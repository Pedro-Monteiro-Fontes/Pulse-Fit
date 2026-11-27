import { prisma } from '@/config/prisma';

export const instrutorRepository = {
  create: (data: { nome: string; email: string; telefone?: string; cref: string }) =>
    prisma.instrutor.create({ data }),

  findAll: () =>
    prisma.instrutor.findMany({ orderBy: { nome: 'asc' } }),

  findById: (id: number) =>
    prisma.instrutor.findUnique({ where: { id } }),

  findByEmail: (email: string) =>
    prisma.instrutor.findUnique({ where: { email } }),

  update: (id: number, data: Partial<{ nome: string; email: string; telefone?: string; cref: string }>) =>
    prisma.instrutor.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.instrutor.delete({ where: { id } }),
};