import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok } from '../../utils/apiResponse';
import { nomineesService } from './nominees.service';

export const nomineesController = {
  listTop: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 5;
    const nominees = await nomineesService.listTop(limit);
    return ok(res, nominees);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const nominee = await nomineesService.getById(req.params.id);
    return ok(res, nominee);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const nominee = await nomineesService.create(req.body);
    return created(res, nominee);
  }),
};
