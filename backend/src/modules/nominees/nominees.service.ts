import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';
import { formatKenyanPhone, authService } from '../auth/auth.service';
import { kopokopoService } from '../payments/kopokopo.service';
import { logger } from '../../utils/logger';

export function getCategoryRegistrationFee(category: { name: string; slug?: string }): number {
  const normName = category.name.toLowerCase().trim();
  const normSlug = (category.slug || '').toLowerCase().trim();

  // 1. 001 Kenya, Rider of the Year, Best Motorcycle dealer of the Year -> KES 1000
  if (
    normName.includes('001') || normSlug.includes('001') ||
    normName.includes('rider of the year') || normSlug.includes('rider-of-the-year') ||
    normName.includes('dealer') || normSlug.includes('dealer')
  ) {
    return 1000;
  }

  // 2. Best Rider group -> KES 5000
  if (
    normName.includes('group') || normSlug.includes('group') ||
    normName.includes('club') || normSlug.includes('club')
  ) {
    return 5000;
  }

  // 3. The rest categories -> KES 500
  return 500;
}

export interface RegisterParticipantInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  password?: string;
  categoryId: string;
  county?: string;
  stageName?: string;
  make?: string;
  model?: string;
  registrationPlate?: string;
  imageUrl?: string;
  userId?: string;
}

export const nomineesService = {
  // Public: list all nominees from PostgreSQL DB
  async listAll(categoryId?: string) {
    return prisma.nominee.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { voteCount: 'desc' },
      include: {
        category: true,
        motorcycle: { include: { images: true, plates: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });
  },

  // Public: top nominees for homepage
  async listTop(limit = 10) {
    return prisma.nominee.findMany({
      orderBy: { voteCount: 'desc' },
      take: limit,
      include: {
        category: true,
        motorcycle: { include: { images: true, plates: true } },
      },
    });
  },

  async getById(id: string) {
    const nominee = await prisma.nominee.findUnique({
      where: { id },
      include: { category: true, motorcycle: { include: { images: true, plates: true } } },
    });

    if (!nominee) {
      throw new AppError('Nominee not found', 404);
    }

    return nominee;
  },

  /**
   * Initiate STK Push Payment for Participant Registration.
   * Prompts user with the exact category registration fee (KES 1000, 5000, or 500).
   */
  async initiateRegistration(input: RegisterParticipantInput) {
    if (!input.categoryId) {
      throw new AppError('Please select an award category', 400);
    }
    if (!input.phone) {
      throw new AppError('Phone number is required for M-Pesa payment', 400);
    }

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new AppError('Selected category does not exist', 404);
    }

    const formattedPhone = formatKenyanPhone(input.phone);
    const fee = getCategoryRegistrationFee(category);

    let first = input.firstName || '';
    let last = input.lastName || '';
    if (input.name && !first) {
      const parts = input.name.trim().split(' ');
      first = parts[0] || 'Rider';
      last = parts.slice(1).join(' ') || '';
    }
    if (!first) first = 'Participant';

    const participantName = `${first} ${last}`.trim();

    // Create or find user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (!user) {
      const nomineeRole = await prisma.role.upsert({
        where: { name: 'NOMINEE' },
        update: {},
        create: { name: 'NOMINEE' },
      });

      const passwordHash = await bcrypt.hash(input.password || 'NduthiParticipant2025!', 12);
      const generatedEmail = input.email || `${formattedPhone.replace('+', '')}@nduthiawards.co.ke`;

      user = await prisma.user.create({
        data: {
          firstName: first,
          lastName: last,
          phone: formattedPhone,
          email: generatedEmail,
          passwordHash,
          roleId: nomineeRole.id,
        },
      });
    }

    // Create Payment record for registration
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        method: 'MPESA',
        amount: fee,
        status: 'PENDING',
      },
    });

    // Store registration payload in transaction for fulfillment upon payment
    await prisma.transaction.create({
      data: {
        paymentId: payment.id,
        event: 'PENDING_REGISTRATION',
        rawPayload: JSON.stringify({
          ...input,
          userId: user.id,
          participantName,
          categoryName: category.name,
          fee,
        }),
      },
    });

    // Initiate Kopo Kopo M-Pesa STK Push
    const stkResult = await kopokopoService.initiateStkPush({
      phone: formattedPhone,
      amount: fee,
      paymentId: payment.id,
      userId: user.id,
      voterName: participantName,
      voterEmail: user.email || undefined,
    });

    if (stkResult.location) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { providerRef: stkResult.location },
      });
    }

    return {
      paymentId: payment.id,
      amount: fee,
      categoryId: category.id,
      categoryName: category.name,
      participantName,
      status: 'PENDING',
      provider: stkResult,
    };
  },

  /**
   * Check participant registration payment status and finalize registration upon payment.
   */
  async checkRegistrationStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: { include: { role: true } } },
    });

    if (!payment) {
      throw new AppError('Registration payment not found', 404);
    }

    // If already finalized
    if (payment.status === 'SUCCESS') {
      const existingNominee = await prisma.nominee.findFirst({
        where: { userId: payment.userId },
        include: { category: true, motorcycle: true, user: true },
      });
      const tokens = await authService.issueTokens(payment.userId, payment.user.role.name);
      return {
        status: 'SUCCESS',
        nominee: existingNominee,
        user: payment.user,
        mpesaRef: payment.providerRef || 'M-PESA-CONFIRMED',
        ...tokens,
      };
    }

    if (payment.status === 'FAILED') {
      return {
        status: 'FAILED',
        reason: 'Payment was cancelled or failed.',
      };
    }

    // Check live status via Kopo Kopo location URL
    if (payment.status === 'PENDING' && payment.providerRef && payment.providerRef.startsWith('http')) {
      const k2Status = await kopokopoService.checkPaymentStatus(payment.providerRef);
      const rawStatus = String(k2Status.status).toLowerCase();

      if (rawStatus === 'success') {
        // Mark payment SUCCESS
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', providerRef: k2Status.mpesaRef || 'M-PESA-CONFIRMED' },
        });

        // Retrieve registration data
        const txn = await prisma.transaction.findFirst({
          where: { paymentId: payment.id, event: 'PENDING_REGISTRATION' },
        });

        let regData: any = {};
        if (txn?.rawPayload) {
          try {
            regData = JSON.parse(txn.rawPayload);
          } catch (e) {
            logger.error(`Failed to parse registration payload for payment ${payment.id}`);
          }
        }

        // Create Motorcycle record
        let motorcycleId: string | undefined = undefined;
        if (regData.make || regData.model || regData.registrationPlate) {
          const plate = regData.registrationPlate
            ? regData.registrationPlate.toUpperCase().trim()
            : `ELD-${Date.now().toString().slice(-5)}`;

          const moto = await prisma.motorcycle.upsert({
            where: { registrationPlate: plate },
            update: { make: regData.make || 'Motorcycle', model: regData.model || 'Boda Boda' },
            create: {
              make: regData.make || 'Motorcycle',
              model: regData.model || 'Boda Boda',
              registrationPlate: plate,
            },
          });
          motorcycleId = moto.id;
        }

        // Create Nominee in PostgreSQL DB
        const nominee = await prisma.nominee.create({
          data: {
            name: regData.participantName || `${payment.user.firstName} ${payment.user.lastName || ''}`.trim(),
            county: regData.county || 'Eldoret, Kenya',
            ownerName: regData.stageName || regData.participantName || `${payment.user.firstName} ${payment.user.lastName || ''}`.trim(),
            categoryId: regData.categoryId,
            motorcycleId: motorcycleId,
            userId: payment.userId,
            imageUrl: regData.imageUrl || '/cat_motorcycle.jpg',
            voteCount: 0,
            isFeatured: true,
          },
          include: { category: true, motorcycle: true, user: true },
        });

        if (txn) {
          await prisma.transaction.update({
            where: { id: txn.id },
            data: { event: 'REGISTRATION_CONFIRMED' },
          });
        }

        const tokens = await authService.issueTokens(payment.userId, payment.user.role.name);

        return {
          status: 'SUCCESS',
          nominee,
          user: payment.user,
          mpesaRef: k2Status.mpesaRef || 'M-PESA-CONFIRMED',
          ...tokens,
        };
      } else if (rawStatus === 'failed' || rawStatus === 'rejected') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });

        return {
          status: 'FAILED',
          reason: 'M-Pesa transaction was cancelled or timed out before PIN was entered.',
        };
      }
    }

    return {
      status: 'PENDING',
      paymentId: payment.id,
    };
  },

  /**
   * Direct registration fallback
   */
  async registerParticipant(input: RegisterParticipantInput) {
    return this.initiateRegistration(input);
  },

  async create(data: {
    name: string;
    categoryId: string;
    county?: string;
    ownerName?: string;
    motorcycleId?: string;
    imageUrl?: string;
  }) {
    return prisma.nominee.create({
      data: { ...data, county: data.county || 'Eldoret, Kenya', voteCount: 0 },
      include: { category: true, motorcycle: true },
    });
  },
};
