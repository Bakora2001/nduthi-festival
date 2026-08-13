import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok } from '../../utils/apiResponse';
import { nomineesService } from './nominees.service';

export const nomineesController = {
  listAll: asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId as string | undefined;
    const nominees = await nomineesService.listAll(categoryId);
    return ok(res, nominees);
  }),

  listTop: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const nominees = await nomineesService.listTop(limit);
    return ok(res, nominees);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const nominee = await nomineesService.getById(req.params.id);
    return ok(res, nominee);
  }),

  registerParticipant: asyncHandler(async (req: Request, res: Response) => {
    const nominee = await nomineesService.registerParticipant(req.body);
    return created(res, nominee, 'Participant registered successfully and added to voting pages!');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const nominee = await nomineesService.create(req.body);
    return created(res, nominee, 'Nominee created successfully');
  }),
};
