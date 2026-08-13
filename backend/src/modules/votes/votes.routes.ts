import { Router } from 'express';
import { votesController } from './votes.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

// Public — live leaderboard is visible to every visitor, no login required.
router.get('/leaderboard', votesController.leaderboard);

// Authenticated — casting a vote requires login (after payment is verified).
router.post('/', requireAuth, votesController.cast);
router.get('/me', requireAuth, votesController.myHistory);

export default router;
