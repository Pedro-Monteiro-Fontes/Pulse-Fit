import { prisma } from '@/config/prisma';

export const alunoRepository = {
  create: (data: { nome: string; cpf: string; email: string; telefone?: string; dataNascimento: Date }) =>
    prisma.aluno.create({ data }),

  findAll: () =>
    prisma.aluno.findMany({ orderBy: { nome: 'asc' } }),

  findById: (id: number) =>
    prisma.aluno.findUnique({ where: { id } }),

  findByCpf: (cpf: string) =>
    prisma.aluno.findUnique({ where: { cpf } }),

  findByEmail: (email: string) =>
    prisma.aluno.findUnique({ where: { email } }),

  update: (id: number, data: Partial<{ nome: string; cpf: string; email: string; telefone?: string; dataNascimento: Date }>) =>
    prisma.aluno.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.aluno.delete({ where: { id } }),
};