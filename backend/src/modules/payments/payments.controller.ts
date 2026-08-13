import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { paymentsService } from './payments.service';
import { mpesaService } from './mpesa.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const paymentsController = {
  initiate: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await paymentsService.initiate({ userId: req.user!.userId, ...req.body });
    return ok(res, result, 'Payment initiated');
  }),

  getStatus: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentsService.getById(req.params.id);
    return ok(res, payment);
  }),

  mpesaCallback: asyncHandler(async (req: Request, res: Response) => {
    await mpesaService.handleCallback(req.body);
    // Safaricom expects a 200 OK acknowledgement regardless of outcome.
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }),
};
