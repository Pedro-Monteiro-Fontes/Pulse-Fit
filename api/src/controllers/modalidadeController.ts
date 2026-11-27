import { Request, Response } from 'express';
import { modalidadeService } from '@/services/modalidadeService';

export const modalidadeController = {
  async create(req: Request, res: Response) {
    const modalidade = await modalidadeService.create(req.body);
    return res.status(201).json(modalidade);
  },

  async findAll(_req: Request, res: Response) {
    const modalidades = await modalidadeService.findAll();
    return res.json(modalidades);
  },

  async findById(req: Request, res: Response) {
    const modalidade = await modalidadeService.findById(Number(req.params.id));
    return res.json(modalidade);
  },

  async update(req: Request, res: Response) {
    const modalidade = await modalidadeService.update(Number(req.params.id), req.body);
    return res.json(modalidade);
  },

  async delete(req: Request, res: Response) {
    await modalidadeService.delete(Number(req.params.id));
    return res.status(204).send();
  },
};