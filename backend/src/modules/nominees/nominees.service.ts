import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';
import { formatKenyanPhone } from '../auth/auth.service';

interface RegisterParticipantInput {
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
   * Register a new Participant (Nominee) into the system quickly.
   */
  async registerParticipant(input: RegisterParticipantInput) {
    if (!input.categoryId) {
      throw new AppError('Please select an award category', 400);
    }
    if (!input.phone) {
      throw new AppError('Phone number is required', 400);
    }

    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new AppError('Selected category does not exist', 404);
    }

    const formattedPhone = formatKenyanPhone(input.phone);

    let first = input.firstName || '';
    let last = input.lastName || '';
    if (input.name && !first) {
      const parts = input.name.trim().split(' ');
      first = parts[0] || 'Rider';
      last = parts.slice(1).join(' ') || '';
    }
    if (!first) first = 'Participant';

    const participantName = `${first} ${last}`.trim();
    let targetUserId = input.userId;

    if (!targetUserId) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: formattedPhone },
            ...(input.email ? [{ email: input.email }] : []),
          ],
        },
      });

      if (existingUser) {
        targetUserId = existingUser.id;
      } else {
        const nomineeRole = await prisma.role.upsert({
          where: { name: 'NOMINEE' },
          update: {},
          create: { name: 'NOMINEE' },
        });

        const passwordHash = await bcrypt.hash(input.password || 'NduthiParticipant2025!', 12);
        const generatedEmail = input.email || `${formattedPhone.replace('+', '')}@nduthiawards.co.ke`;

        const newUser = await prisma.user.create({
          data: {
            firstName: first,
            lastName: last,
            phone: formattedPhone,
            email: generatedEmail,
            passwordHash,
            roleId: nomineeRole.id,
          },
        });
        targetUserId = newUser.id;
      }
    }

    // Create Motorcycle record if info supplied
    let motorcycleId: string | undefined = undefined;
    if (input.make || input.model || input.registrationPlate) {
      const plate = input.registrationPlate
        ? input.registrationPlate.toUpperCase().trim()
        : `ELD-${Date.now().toString().slice(-5)}`;

      const moto = await prisma.motorcycle.upsert({
        where: { registrationPlate: plate },
        update: { make: input.make || 'Motorcycle', model: input.model || 'Boda Boda' },
        create: {
          make: input.make || 'Motorcycle',
          model: input.model || 'Boda Boda',
          registrationPlate: plate,
        },
      });
      motorcycleId = moto.id;
    }

    // Create Nominee entry in PostgreSQL
    const nominee = await prisma.nominee.create({
      data: {
        name: participantName,
        county: input.county || 'Eldoret, Kenya',
        ownerName: input.stageName || participantName,
        categoryId: input.categoryId,
        motorcycleId: motorcycleId,
        userId: targetUserId,
        imageUrl: input.imageUrl || '/cat_motorcycle.jpg',
        voteCount: 0,
        isFeatured: true,
      },
      include: {
        category: true,
        motorcycle: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });

    return nominee;
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
