import { Router } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created } from '../../utils/apiResponse';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });
  return ok(res, news);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const article = await prisma.news.findUnique({ where: { slug: req.params.slug } });
  return ok(res, article);
}));

router.post('/', requireAuth, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const article = await prisma.news.create({ data: req.body });
  return created(res, article);
}));

export default router;
