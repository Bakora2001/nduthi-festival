import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { paymentsService } from './payments.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const paymentsController = {
  initiate: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await paymentsService.initiate({
      userId: req.user!.userId,
      nomineeId: req.body.nomineeId,
      phone: req.body.phone,
      amount: req.body.amount ? Number(req.body.amount) : undefined,
      method: req.body.method || 'MPESA',
    });
    return ok(res, result, 'Payment initiated successfully');
  }),

  checkStatus: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await paymentsService.checkStatus({
      paymentId: req.params.id,
      nomineeId: req.query.nomineeId as string,
      userId: req.user!.userId,
    });
    return ok(res, result);
  }),

  getStatus: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentsService.getById(req.params.id);
    return ok(res, payment);
  }),

  confirmVote: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await paymentsService.confirmAndCastVote({
      paymentId: req.body.paymentId,
      nomineeId: req.body.nomineeId,
      userId: req.user!.userId,
      mpesaRef: req.body.mpesaRef,
    });
    return ok(res, result, 'Vote confirmed successfully!');
  }),

  kopokopoCallback: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentsService.handleKopokopoCallback(req.body);
    return res.status(200).json({ status: 'success', data: result });
  }),
};
