import { Router } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created } from '../../utils/apiResponse';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { startsAt: 'asc' } });
  return ok(res, events);
}));

router.post('/', requireAuth, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const event = await prisma.event.create({ data: req.body });
  return created(res, event);
}));

export default router;
