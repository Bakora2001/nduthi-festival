import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/initiate', requireAuth, paymentsController.initiate);
router.get('/:id', requireAuth, paymentsController.getStatus);

// Public webhook endpoint — Safaricom calls this directly, no user JWT present.
router.post('/mpesa/callback', paymentsController.mpesaCallback);

export default router;
