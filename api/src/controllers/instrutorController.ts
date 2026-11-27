import { Request, Response } from 'express';
import { instrutorService } from '@/services/instrutorService';

export const instrutorController = {
  async create(req: Request, res: Response) {
    const instrutor = await instrutorService.create(req.body);
    return res.status(201).json(instrutor);
  },

  async findAll(_req: Request, res: Response) {
    const instrutores = await instrutorService.findAll();
    return res.json(instrutores);
  },

  async findById(req: Request, res: Response) {
    const instrutor = await instrutorService.findById(Number(req.params.id));
    return res.json(instrutor);
  },

  async update(req: Request, res: Response) {
    const instrutor = await instrutorService.update(Number(req.params.id), req.body);
    return res.json(instrutor);
  },

  async delete(req: Request, res: Response) {
    await instrutorService.delete(Number(req.params.id));
    return res.status(204).send();
  },
};