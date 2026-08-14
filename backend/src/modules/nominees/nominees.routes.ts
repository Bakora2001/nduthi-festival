import { Router } from 'express';
import { nomineesController } from './nominees.controller';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', nomineesController.listAll);
router.get('/top', nomineesController.listTop);
router.get('/:id', nomineesController.getById);

// Public / User Participant Registration with M-Pesa STK Push
router.post('/register', nomineesController.registerParticipant);
router.post('/initiate-registration', nomineesController.initiateRegistration);
router.get('/check-registration/:paymentId', nomineesController.checkRegistrationStatus);

// Admin only
router.post('/', requireAuth, requireRole('SUPER_ADMIN'), nomineesController.create);

export default router;
