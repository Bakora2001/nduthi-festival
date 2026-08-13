import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok } from '../../utils/apiResponse';
import { authService } from './auth.service';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.register(req.body);
    return created(res, tokens, 'Account created successfully');
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.login(req.body);
    return ok(res, tokens, 'Logged in successfully');
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    // TODO: generate reset token, email reset link.
    return ok(res, null, 'If that email exists, a reset link has been sent');
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    // TODO: verify reset token and update password.
    return ok(res, null, 'Password has been reset');
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    // TODO: verify email token.
    return ok(res, null, 'Email verified successfully');
  }),
};
