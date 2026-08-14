import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { kopokopoService } from './kopokopo.service';
import { broadcast, SOCKET_EVENTS } from '../../sockets';
import { emailService } from '../../utils/email';
import { logger } from '../../utils/logger';

const VOTE_PRICE_KES = 1; // KES 1 per vote for testing

interface InitiatePaymentInput {
  userId: string;
  nomineeId: string;
  method: 'MPESA' | 'AIRTEL_MONEY' | 'VISA' | 'MASTERCARD';
  phone: string;
}

export const paymentsService = {
  /**
   * Initiate M-Pesa STK Push payment for voting (KES 1)
   */
  async initiate(input: InitiatePaymentInput) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw new AppError('User not found', 404);

    const nominee = await prisma.nominee.findUnique({
      where: { id: input.nomineeId },
      include: { category: true },
    });
    if (!nominee) throw new AppError('Nominee not found', 404);

    const payment = await prisma.payment.create({
      data: {
        userId: input.userId,
        method: input.method,
        amount: VOTE_PRICE_KES,
        status: 'PENDING',
      },
    });

    const stkResult = await kopokopoService.initiateStkPush({
      phone: input.phone,
      amount: VOTE_PRICE_KES,
      paymentId: payment.id,
      nomineeId: input.nomineeId,
      userId: input.userId,
      voterName: `${user.firstName} ${user.lastName}`,
      voterEmail: user.email,
    });

    // Save location URL in providerRef for live polling
    if (stkResult.location) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { providerRef: stkResult.location },
      });
    }

    return {
      paymentId: payment.id,
      nomineeId: nominee.id,
      nomineeName: nominee.name,
      categoryName: nominee.category.name,
      amount: VOTE_PRICE_KES,
      status: 'PENDING',
      provider: stkResult,
    };
  },

  /**
   * Check real-time payment status (polled by frontend or webhook)
   */
  async checkStatus(params: { paymentId: string; nomineeId?: string; userId: string }) {
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: { user: true },
    });

    if (!payment) throw new AppError('Payment not found', 404);

    // 1. If already SUCCESS, return status
    if (payment.status === 'SUCCESS') {
      return {
        status: 'SUCCESS',
        paymentId: payment.id,
        amount: Number(payment.amount),
        mpesaRef: payment.providerRef && !payment.providerRef.startsWith('http') ? payment.providerRef : 'M-PESA-CONFIRMED',
        completed: true,
      };
    }

    // 2. If already FAILED, return status
    if (payment.status === 'FAILED') {
      return {
        status: 'FAILED',
        paymentId: payment.id,
        reason: 'Payment was cancelled or failed.',
        completed: true,
      };
    }

    // 3. If PENDING and we have a Kopo Kopo location URL, query live status
    if (payment.status === 'PENDING' && payment.providerRef && payment.providerRef.startsWith('http')) {
      const k2Status = await kopokopoService.checkPaymentStatus(payment.providerRef);
      const rawStatus = String(k2Status.status).toLowerCase();

      if (rawStatus === 'success') {
        // Payment is confirmed!
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', providerRef: k2Status.mpesaRef || 'M-PESA-CONFIRMED' },
          include: { user: true },
        });

        if (params.nomineeId) {
          await this.fulfillVoteAndNotify({
            paymentId: updatedPayment.id,
            userId: updatedPayment.userId,
            nomineeId: params.nomineeId,
            user: updatedPayment.user,
            amount: Number(updatedPayment.amount),
            mpesaRef: k2Status.mpesaRef || 'KopoKopo-STK',
          });
        }

        return {
          status: 'SUCCESS',
          paymentId: payment.id,
          mpesaRef: k2Status.mpesaRef || 'M-PESA-CONFIRMED',
          amount: Number(payment.amount),
          completed: true,
        };
      } else if (rawStatus === 'failed' || rawStatus === 'rejected') {
        // Payment failed or cancelled by user
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });

        let nomineeName = 'Nominee';
        let categoryName = 'Awards Category';
        if (params.nomineeId) {
          const nom = await prisma.nominee.findUnique({
            where: { id: params.nomineeId },
            include: { category: true },
          });
          if (nom) {
            nomineeName = nom.name;
            categoryName = nom.category.name;
          }
        }

        // Send payment failed email
        emailService.sendPaymentFailedNotification({
          toEmail: payment.user.email,
          voterName: `${payment.user.firstName} ${payment.user.lastName}`,
          nomineeName,
          categoryName,
          amount: Number(payment.amount),
          reason: 'M-Pesa payment prompt was cancelled or timed out before PIN was entered.',
        });

        return {
          status: 'FAILED',
          paymentId: payment.id,
          reason: 'M-Pesa transaction was cancelled or timed out.',
          completed: true,
        };
      }
    }

    return {
      status: 'PENDING',
      paymentId: payment.id,
      completed: false,
    };
  },

  /**
   * Complete payment verification and vote recording directly
   */
  async confirmAndCastVote(params: { paymentId: string; nomineeId: string; userId: string; mpesaRef?: string }) {
    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
      include: { user: true },
    });

    if (!payment) throw new AppError('Payment not found', 404);
    if (payment.userId !== params.userId) throw new AppError('Payment user mismatch', 403);

    const updatedPayment = await prisma.payment.update({
      where: { id: params.paymentId },
      data: { status: 'SUCCESS', providerRef: params.mpesaRef || 'M-PESA-STK-SUCCESS' },
      include: { user: true },
    });

    return this.fulfillVoteAndNotify({
      paymentId: updatedPayment.id,
      userId: updatedPayment.userId,
      nomineeId: params.nomineeId,
      user: updatedPayment.user,
      amount: Number(updatedPayment.amount),
      mpesaRef: params.mpesaRef || 'M-PESA-STK-SUCCESS',
    });
  },

  /**
   * Process Kopo Kopo Webhook Callback when M-Pesa payment is completed
   */
  async handleKopokopoCallback(payload: any) {
    logger.info(`[KopoKopo Callback] Received payload: ${JSON.stringify(payload)}`);

    try {
      const attributes = payload.data?.attributes || payload.attributes || payload;
      const metadata = attributes.metadata || attributes.event?.resource?.metadata || {};
      const status = attributes.status || attributes.event?.resource?.status;

      const paymentId = metadata.payment_id || payload.paymentId;
      const nomineeId = metadata.nominee_id || payload.nomineeId;
      const userId = metadata.user_id || payload.userId;

      if (!paymentId) {
        logger.warn('[KopoKopo Callback] Missing payment_id in metadata');
        return { message: 'Callback received but missing payment_id' };
      }

      const isSuccess = String(status).toLowerCase() === 'success';
      const paymentStatus = isSuccess ? 'SUCCESS' : 'FAILED';

      // Mark payment status in DB
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: paymentStatus },
        include: { user: true },
      });

      await prisma.transaction.create({
        data: {
          paymentId,
          event: paymentStatus,
          rawPayload: JSON.stringify(payload),
        },
      });

      if (isSuccess && nomineeId) {
        await this.fulfillVoteAndNotify({
          paymentId: payment.id,
          userId: payment.userId,
          nomineeId,
          user: payment.user,
          amount: Number(payment.amount),
          mpesaRef: attributes.event?.resource?.reference || attributes.id || 'KopoKopo-STK',
        });
      } else if (!isSuccess) {
        let nomineeName = 'Nominee';
        let categoryName = 'Awards Category';
        if (nomineeId) {
          const nom = await prisma.nominee.findUnique({
            where: { id: nomineeId },
            include: { category: true },
          });
          if (nom) {
            nomineeName = nom.name;
            categoryName = nom.category.name;
          }
        }

        emailService.sendPaymentFailedNotification({
          toEmail: payment.user.email,
          voterName: `${payment.user.firstName} ${payment.user.lastName}`,
          nomineeName,
          categoryName,
          amount: Number(payment.amount),
          reason: attributes.event?.resource?.error_message || 'M-Pesa payment prompt was cancelled or timed out.',
        });
      }

      return { status: paymentStatus, paymentId };
    } catch (err: any) {
      logger.error(`[KopoKopo Callback Error]: ${err.message}`);
      throw err;
    }
  },

  /**
   * Helper method to record vote, update tally, emit socket, and dispatch emails
   */
  async fulfillVoteAndNotify(params: {
    paymentId: string;
    userId: string;
    nomineeId: string;
    user: any;
    amount: number;
    mpesaRef?: string;
  }) {
    // Check duplicate vote
    const existingVote = await prisma.vote.findUnique({ where: { paymentId: params.paymentId } });
    if (existingVote) {
      return { vote: existingVote, alreadyVoted: true };
    }

    const [vote, nominee] = await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId: params.userId,
          nomineeId: params.nomineeId,
          paymentId: params.paymentId,
        },
      }),
      prisma.nominee.update({
        where: { id: params.nomineeId },
        data: { voteCount: { increment: 1 } },
        include: { category: true },
      }),
    ]);

    // Broadcast live WebSocket update to all connected clients
    broadcast(SOCKET_EVENTS.VOTE_CAST, {
      nomineeId: nominee.id,
      nomineeName: nominee.name,
      categoryId: nominee.categoryId,
      categoryName: nominee.category.name,
      voteCount: nominee.voteCount,
    });

    // Send emails asynchronously
    emailService.sendVoteConfirmation({
      toEmail: params.user.email,
      voterName: `${params.user.firstName} ${params.user.lastName}`,
      nomineeName: nominee.name,
      categoryName: nominee.category.name,
      amount: params.amount,
      mpesaReference: params.mpesaRef,
    });

    emailService.sendAdminPaymentNotification({
      voterName: `${params.user.firstName} ${params.user.lastName}`,
      voterEmail: params.user.email,
      voterPhone: params.user.phone || undefined,
      nomineeName: nominee.name,
      categoryName: nominee.category.name,
      amount: params.amount,
      mpesaReference: params.mpesaRef,
    });

    return { vote, nominee };
  },

  async getById(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  },
};
