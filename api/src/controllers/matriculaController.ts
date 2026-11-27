import { Request, Response } from 'express';
import { matriculaService } from '@/services/matriculaService';

export const matriculaController = {
  async create(req: Request, res: Response) {
    const matricula = await matriculaService.create(req.body);
    return res.status(201).json(matricula);
  },

  async findAll(_req: Request, res: Response) {
    const matriculas = await matriculaService.findAll();
    return res.json(matriculas);
  },

  async findById(req: Request, res: Response) {
    const matricula = await matriculaService.findById(Number(req.params.id));
    return res.json(matricula);
  },

  async updateStatus(req: Request, res: Response) {
    const matricula = await matriculaService.updateStatus(Number(req.params.id), req.body.status);
    return res.json(matricula);
  },

  async delete(req: Request, res: Response) {
    await matriculaService.delete(Number(req.params.id));
    return res.status(204).send();
  },
};