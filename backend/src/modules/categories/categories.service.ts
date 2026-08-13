import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const categoriesService = {
  // Public: browse all categories with nominee + vote counts — no auth required.
  async listAll() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { nominees: true } },
        nominees: { select: { voteCount: true } },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      coverImage: c.coverImage,
      nomineeCount: c._count.nominees,
      totalVotes: c.nominees.reduce((sum, n) => sum + n.voteCount, 0),
    }));
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        nominees: {
          orderBy: { voteCount: 'desc' },
          include: { motorcycle: { include: { images: true, plates: true } } },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  },

  async create(data: { name: string; slug: string; description?: string; icon?: string }) {
    return prisma.category.create({ data });
  },
};
