import { Router } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created } from '../../utils/apiResponse';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const images = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
  return ok(res, images);
}));

router.post('/', requireAuth, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const image = await prisma.gallery.create({ data: req.body });
  return created(res, image);
}));

export default router;
