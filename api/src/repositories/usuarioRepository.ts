import { prisma } from '@/config/prisma';

export const usuarioRepository = {
  create: (data: { nome: string; email: string; senhaHash: string }) =>
    prisma.usuario.create({ data }),

  findById: (id: number) =>
    prisma.usuario.findUnique({ where: { id } }),

  findByEmail: (email: string) =>
    prisma.usuario.findUnique({ where: { email } }),
};