import { prisma } from '@/config/prisma';

export const matriculaRepository = {
  create: (data: { alunoId: number; modalidadeId: number; dataInicio?: Date; status?: string }) =>
    prisma.matricula.create({ data }),

  findAll: () =>
    prisma.matricula.findMany({
      include: { aluno: true, modalidade: { include: { instrutor: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.matricula.findUnique({
      where: { id },
      include: { aluno: true, modalidade: { include: { instrutor: true } } },
    }),

  findByAlunoId: (alunoId: number) =>
    prisma.matricula.findMany({
      where: { alunoId },
      include: { modalidade: { include: { instrutor: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findByModalidadeId: (modalidadeId: number) =>
    prisma.matricula.findMany({
      where: { modalidadeId },
      include: { aluno: true },
      orderBy: { createdAt: 'desc' },
    }),

  findByAlunoAndModalidade: (alunoId: number, modalidadeId: number) =>
    prisma.matricula.findUnique({ where: { alunoId_modalidadeId: { alunoId, modalidadeId } } }),

  update: (id: number, data: Partial<{ alunoId: number; modalidadeId: number; dataInicio: Date; status: string }>) =>
    prisma.matricula.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.matricula.delete({ where: { id } }),
};