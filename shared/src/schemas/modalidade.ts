import { z } from 'zod';

export const modalidadeCreateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  descricao: z.string().max(500).optional(),
  instrutorId: z.number().int().positive('Instrutor ID deve ser um número positivo'),
});

export const modalidadeUpdateSchema = modalidadeCreateSchema.partial();

export const modalidadeOutputSchema = modalidadeCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ModalidadeCreate = z.infer<typeof modalidadeCreateSchema>;
export type ModalidadeUpdate = z.infer<typeof modalidadeUpdateSchema>;
export type Modalidade = z.infer<typeof modalidadeOutputSchema>;