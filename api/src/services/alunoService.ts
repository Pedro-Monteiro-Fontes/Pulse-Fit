import { alunoRepository } from '@/repositories/alunoRepository';
import { matriculaRepository } from '@/repositories/matriculaRepository';

export const alunoService = {
  async create(data: { nome: string; cpf: string; email: string; telefone?: string; dataNascimento: Date }) {
    const existsCpf = await alunoRepository.findByCpf(data.cpf);
    if (existsCpf) {
      const err = new Error('CPF já cadastrado');
      (err as any).statusCode = 409;
      throw err;
    }
    const existsEmail = await alunoRepository.findByEmail(data.email);
    if (existsEmail) {
      const err = new Error('Email já cadastrado');
      (err as any).statusCode = 409;
      throw err;
    }
    return alunoRepository.create(data);
  },

  async findAll() {
    return alunoRepository.findAll();
  },

  async findById(id: number) {
    const aluno = await alunoRepository.findById(id);
    if (!aluno) {
      const err = new Error('Aluno não encontrado');
      (err as any).statusCode = 404;
      throw err;
    }
    return aluno;
  },

  async update(id: number, data: Partial<{ nome: string; cpf: string; email: string; telefone?: string; dataNascimento: Date }>) {
    await this.findById(id);
    if (data.cpf) {
      const exists = await alunoRepository.findByCpf(data.cpf);
      if (exists && exists.id !== id) {
        const err = new Error('CPF já cadastrado');
        (err as any).statusCode = 409;
        throw err;
      }
    }
    if (data.email) {
      const exists = await alunoRepository.findByEmail(data.email);
      if (exists && exists.id !== id) {
        const err = new Error('Email já cadastrado');
        (err as any).statusCode = 409;
        throw err;
      }
    }
    return alunoRepository.update(id, data);
  },

  async delete(id: number) {
    await this.findById(id);
    const matriculas = await matriculaRepository.findByAlunoId(id);
    const ativas = matriculas.filter(m => m.status === 'ativa');
    if (ativas.length > 0) {
      const err = new Error('Não é possível excluir aluno com matrículas ativas');
      (err as any).statusCode = 409;
      throw err;
    }
    return alunoRepository.delete(id);
  },
};