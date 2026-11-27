import { z } from 'zod';

const telefoneSchema = z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX');
const emailSchema = z.string().email('Email inválido');
const crefSchema = z.string().regex(/^\d{3}-\d{3}\/[A-Z]{2}$/, 'CREF deve estar no formato XXX-XXX/UF');

export const instrutorCreateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: emailSchema,
  telefone: telefoneSchema.optional(),
  cref: crefSchema,
});

export const instrutorUpdateSchema = instrutorCreateSchema.partial();

export const instrutorOutputSchema = instrutorCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InstrutorCreate = z.infer<typeof instrutorCreateSchema>;
export type InstrutorUpdate = z.infer<typeof instrutorUpdateSchema>;
export type Instrutor = z.infer<typeof instrutorOutputSchema>;