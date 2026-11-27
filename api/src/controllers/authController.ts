import { Request, Response } from 'express';
import { authService } from '@/services/authService';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.json(result);
  },

  async me(req: Request, res: Response) {
    const user = await authService.me(String(req.user!.sub));
    return res.json(user);
  },
};