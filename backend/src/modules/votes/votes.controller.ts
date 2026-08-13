import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok } from '../../utils/apiResponse';
import { votesService } from './votes.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const votesController = {
  cast: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const vote = await votesService.cast({ userId: req.user!.userId, ...req.body });
    return created(res, vote, 'Vote cast successfully');
  }),

  myHistory: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const history = await votesService.historyForUser(req.user!.userId);
    return ok(res, history);
  }),

  leaderboard: asyncHandler(async (req, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const board = await votesService.leaderboard(limit);
    return ok(res, board);
  }),
};
