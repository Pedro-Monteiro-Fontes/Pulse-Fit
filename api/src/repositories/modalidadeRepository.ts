import { prisma } from '@/config/prisma';

export const modalidadeRepository = {
  create: (data: { nome: string; descricao?: string; instrutorId: number }) =>
    prisma.modalidade.create({ data }),

  findAll: () =>
    prisma.modalidade.findMany({
      include: { instrutor: true },
      orderBy: { nome: 'asc' },
    }),

  findById: (id: number) =>
    prisma.modalidade.findUnique({ where: { id }, include: { instrutor: true } }),

  findByNome: (nome: string) =>
    prisma.modalidade.findUnique({ where: { nome } }),

  findByInstrutorId: (instrutorId: number) =>
    prisma.modalidade.findMany({ where: { instrutorId }, orderBy: { nome: 'asc' } }),

  update: (id: number, data: Partial<{ nome: string; descricao?: string; instrutorId: number }>) =>
    prisma.modalidade.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.modalidade.delete({ where: { id } }),
};