import { Request, Response } from 'express';
import { alunoService } from '@/services/alunoService';

export const alunoController = {
  async create(req: Request, res: Response) {
    const aluno = await alunoService.create(req.body);
    return res.status(201).json(aluno);
  },

  async findAll(_req: Request, res: Response) {
    const alunos = await alunoService.findAll();
    return res.json(alunos);
  },

  async findById(req: Request, res: Response) {
    const aluno = await alunoService.findById(Number(req.params.id));
    return res.json(aluno);
  },

  async update(req: Request, res: Response) {
    const aluno = await alunoService.update(Number(req.params.id), req.body);
    return res.json(aluno);
  },

  async delete(req: Request, res: Response) {
    await alunoService.delete(Number(req.params.id));
    return res.status(204).send();
  },
};