import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const senhaSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100);

export const usuarioCreateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: emailSchema,
  senha: senhaSchema,
});

export const usuarioLoginSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
});

export const usuarioOutputSchema = usuarioCreateSchema.omit({ senha: true }).extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>;
export type UsuarioLogin = z.infer<typeof usuarioLoginSchema>;
export type Usuario = z.infer<typeof usuarioOutputSchema>;