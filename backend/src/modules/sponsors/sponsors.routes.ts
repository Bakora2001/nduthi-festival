import { Router } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created } from '../../utils/apiResponse';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const sponsors = await prisma.sponsor.findMany({ where: { isActive: true } });
  return ok(res, sponsors);
}));

router.post('/', requireAuth, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const sponsor = await prisma.sponsor.create({ data: req.body });
  return created(res, sponsor);
}));

export default router;
