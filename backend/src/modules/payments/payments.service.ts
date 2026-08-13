import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { mpesaService } from './mpesa.service';

const VOTE_PRICE_KES = 100; // One payment = one vote (TID Section 3).

interface InitiatePaymentInput {
  userId: string;
  method: 'MPESA' | 'AIRTEL_MONEY' | 'VISA' | 'MASTERCARD';
  phone?: string;
}

export const paymentsService = {
  // Step 1 of the voting workflow: user clicks "Vote Now" -> payment page -> this runs.
  async initiate(input: InitiatePaymentInput) {
    const payment = await prisma.payment.create({
      data: {
        userId: input.userId,
        method: input.method,
        amount: VOTE_PRICE_KES,
        status: 'PENDING',
      },
    });

    if (input.method === 'MPESA') {
      if (!input.phone) throw new AppError('Phone number is required for M-Pesa payments', 422);
      const stk = await mpesaService.stkPush({
        phone: input.phone,
        amount: VOTE_PRICE_KES,
        accountReference: payment.id,
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: { providerRef: stk.checkoutRequestId },
      });

      return { payment, provider: stk };
    }

    // TODO: Airtel Money / Visa / Mastercard provider integrations follow the
    // same pattern — create a pending Payment, kick off the provider charge,
    // then verify via webhook/callback below.
    return { payment, provider: null };
  },

  // Step 2: payment provider confirms success/failure via webhook.
  async markStatus(paymentId: string, status: 'SUCCESS' | 'FAILED', rawPayload?: unknown) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });

    await prisma.transaction.create({
      data: {
        paymentId,
        event: status,
        rawPayload: rawPayload ? JSON.stringify(rawPayload) : undefined,
      },
    });

    return payment;
  },

  async getById(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  },
};
