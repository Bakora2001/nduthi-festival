import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Public — browsing categories never requires login (per TID Section 3).
router.get('/', categoriesController.list);
router.get('/:slug', categoriesController.getBySlug);

// Admin only
router.post('/', requireAuth, requireRole('SUPER_ADMIN'), categoriesController.create);

export default router;
