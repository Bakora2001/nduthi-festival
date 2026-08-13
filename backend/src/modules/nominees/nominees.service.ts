import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const nomineesService = {
  // Public: used by the homepage "Top Nominees" widget and category pages.
  async listTop(limit = 5) {
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

  async create(data: {
    name: string;
    categoryId: string;
    county?: string;
    ownerName?: string;
    motorcycleId?: string;
    displayImageType?: 'MOTORCYCLE_PHOTO' | 'NUMBER_PLATE';
  }) {
    return prisma.nominee.create({ data });
  },
};
