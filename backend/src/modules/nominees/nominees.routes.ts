import { Router } from 'express';
import { nomineesController } from './nominees.controller';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Public
router.get('/top', nomineesController.listTop);
router.get('/:id', nomineesController.getById);

// Admin only
router.post('/', requireAuth, requireRole('SUPER_ADMIN'), nomineesController.create);

export default router;
