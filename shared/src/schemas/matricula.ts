import { z } from 'zod';

const statusEnum = z.enum(['ativa', 'cancelada']);
const dataInicioSchema = z.string().datetime({ offset: true }).or(z.date());

export const matriculaCreateSchema = z.object({
  alunoId: z.number().int().positive('Aluno ID deve ser um número positivo'),
  modalidadeId: z.number().int().positive('Modalidade ID deve ser um número positivo'),
  dataInicio: dataInicioSchema.optional(),
  status: statusEnum.default('ativa'),
});

export const matriculaUpdateSchema = z.object({
  dataInicio: dataInicioSchema.optional(),
  status: statusEnum.optional(),
});

export const matriculaOutputSchema = matriculaCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MatriculaCreate = z.infer<typeof matriculaCreateSchema>;
export type MatriculaUpdate = z.infer<typeof matriculaUpdateSchema>;
export type Matricula = z.infer<typeof matriculaOutputSchema>;