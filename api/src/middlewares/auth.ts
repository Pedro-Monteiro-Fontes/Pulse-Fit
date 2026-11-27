import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { verifyToken, JwtPayload } from '../config/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const user = await prisma.usuario.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const user = await prisma.usuario.findUnique({ where: { id: Number(payload.sub) } });
    if (user) req.user = payload;
  } catch {
    // ignore invalid token
  }
  next();
}