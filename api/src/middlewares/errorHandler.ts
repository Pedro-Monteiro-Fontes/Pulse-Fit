import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { env } from '../config/env';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ errors: err.flatten() });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Conflito: registro duplicado' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }
  }

  const statusCode = err.statusCode ?? 500;
  return res.status(statusCode).json({ message: err.message ?? 'Erro interno do servidor' });
}