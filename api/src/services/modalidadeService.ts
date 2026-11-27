import { modalidadeRepository } from '@/repositories/modalidadeRepository';
import { instrutorRepository } from '@/repositories/instrutorRepository';
import { matriculaRepository } from '@/repositories/matriculaRepository';

export const modalidadeService = {
  async create(data: { nome: string; descricao?: string; instrutorId: number }) {
    const instrutor = await instrutorRepository.findById(data.instrutorId);
    if (!instrutor) {
      const err = new Error('Instrutor não encontrado');
      (err as any).statusCode = 404;
      throw err;
    }
    const exists = await modalidadeRepository.findByNome(data.nome);
    if (exists) {
      const err = new Error('Modalidade já cadastrada');
      (err as any).statusCode = 409;
      throw err;
    }
    return modalidadeRepository.create(data);
  },

  async findAll() {
    return modalidadeRepository.findAll();
  },

  async findById(id: number) {
    const modalidade = await modalidadeRepository.findById(id);
    if (!modalidade) {
      const err = new Error('Modalidade não encontrada');
      (err as any).statusCode = 404;
      throw err;
    }
    return modalidade;
  },

  async update(id: number, data: Partial<{ nome: string; descricao?: string; instrutorId: number }>) {
    await this.findById(id);
    if (data.nome) {
      const exists = await modalidadeRepository.findByNome(data.nome);
      if (exists && exists.id !== id) {
        const err = new Error('Modalidade já cadastrada');
        (err as any).statusCode = 409;
        throw err;
      }
    }
    if (data.instrutorId) {
      const instrutor = await instrutorRepository.findById(data.instrutorId);
      if (!instrutor) {
        const err = new Error('Instrutor não encontrado');
        (err as any).statusCode = 404;
        throw err;
      }
    }
    return modalidadeRepository.update(id, data);
  },

  async delete(id: number) {
    await this.findById(id);
    const matriculas = await matriculaRepository.findByModalidadeId(id);
    if (matriculas.length > 0) {
      const err = new Error('Não é possível excluir modalidade com matrículas vinculadas');
      (err as any).statusCode = 409;
      throw err;
    }
    return modalidadeRepository.delete(id);
  },
};