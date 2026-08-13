import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/initiate', requireAuth, paymentsController.initiate);
router.post('/confirm-vote', requireAuth, paymentsController.confirmVote);
router.get('/:id', requireAuth, paymentsController.getStatus);

// Kopo Kopo Webhook Callback (Public endpoint called by Kopo Kopo servers)
router.post('/kopokopo/callback', paymentsController.kopokopoCallback);
router.post('/mpesa/callback', paymentsController.kopokopoCallback);

export default router;
