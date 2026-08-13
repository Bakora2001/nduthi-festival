import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';

interface RegisterParticipantInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  categoryId: string;
  county?: string;
  stageName?: string; // e.g. Stage/Location or Club Name
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
   * Register a new Participant (Nominee) into the system.
   * Creates User (role NOMINEE), Motorcycle record, and Nominee record.
   * Participant will AUTOMATICALLY appear on voting pages!
   */
  async registerParticipant(input: RegisterParticipantInput) {
    // 1. Check category existence
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new AppError('Selected category does not exist', 404);
    }

    let targetUserId = input.userId;

    // If userId not provided, create user or find by email
    if (!targetUserId) {
      const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
      if (existingUser) {
        targetUserId = existingUser.id;
      } else {
        const nomineeRole = await prisma.role.upsert({
          where: { name: 'NOMINEE' },
          update: {},
          create: { name: 'NOMINEE' },
        });

        const passwordHash = await bcrypt.hash(input.password || 'NduthiParticipant2025!', 12);
        const newUser = await prisma.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            passwordHash,
            roleId: nomineeRole.id,
          },
        });
        targetUserId = newUser.id;
      }
    }

    // 2. Create Motorcycle record if bike info supplied
    let motorcycleId: string | undefined = undefined;
    if (input.make || input.model || input.registrationPlate) {
      const plate = input.registrationPlate
        ? input.registrationPlate.toUpperCase().trim()
        : `STAGE-${Date.now().toString().slice(-6)}`;

      const moto = await prisma.motorcycle.upsert({
        where: { registrationPlate: plate },
        update: { make: input.make || 'Generic', model: input.model || 'Boda Boda' },
        create: {
          make: input.make || 'Generic',
          model: input.model || 'Boda Boda',
          registrationPlate: plate,
        },
      });
      motorcycleId = moto.id;
    }

    const participantName = `${input.firstName} ${input.lastName}`.trim();

    // 3. Create Nominee entry in PostgreSQL
    const nominee = await prisma.nominee.create({
      data: {
        name: participantName,
        county: input.county || 'Nairobi',
        ownerName: input.stageName || participantName,
        categoryId: input.categoryId,
        motorcycleId: motorcycleId,
        userId: targetUserId,
        imageUrl: input.imageUrl || '/cat_rider_awards.jpg',
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
      data: { ...data, voteCount: 0 },
      include: { category: true, motorcycle: true },
    });
  },
};
