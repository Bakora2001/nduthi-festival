import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok } from '../../utils/apiResponse';
import { authService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return created(res, result, 'Account created successfully');
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return ok(res, result, 'Logged in successfully');
  }),

  me: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const profile = await authService.getMe(req.user!.userId);
    return ok(res, profile);
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    return ok(res, null, 'If that email exists, a reset link has been sent');
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    return ok(res, null, 'Password has been reset');
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    return ok(res, null, 'Email verified successfully');
  }),
};
