import { z } from 'zod';

const telefoneSchema = z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX');
const emailSchema = z.string().email('Email inválido');

function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros[10])) return false;

  return true;
}

const cpfSchema = z.string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
  .refine(validarCPF, 'CPF inválido');

const dataNascimentoSchema = z.string().datetime({ offset: true }).or(z.date());

export const alunoCreateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema.optional(),
  dataNascimento: dataNascimentoSchema,
});

export const alunoUpdateSchema = alunoCreateSchema.partial();

export const alunoOutputSchema = alunoCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AlunoCreate = z.infer<typeof alunoCreateSchema>;
export type AlunoUpdate = z.infer<typeof alunoUpdateSchema>;
export type Aluno = z.infer<typeof alunoOutputSchema>;