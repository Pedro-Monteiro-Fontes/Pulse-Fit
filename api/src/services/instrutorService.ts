import { instrutorRepository } from '@/repositories/instrutorRepository';
import { modalidadeRepository } from '@/repositories/modalidadeRepository';

export const instrutorService = {
  async create(data: { nome: string; email: string; telefone?: string; cref: string }) {
    const existsEmail = await instrutorRepository.findByEmail(data.email);
    if (existsEmail) {
      const err = new Error('Email já cadastrado');
      (err as any).statusCode = 409;
      throw err;
    }
    const existsCref = await instrutorRepository.findByEmail(data.cref);
    if (existsCref) {
      const err = new Error('CREF já cadastrado');
      (err as any).statusCode = 409;
      throw err;
    }
    return instrutorRepository.create(data);
  },

  async findAll() {
    return instrutorRepository.findAll();
  },

  async findById(id: number) {
    const instrutor = await instrutorRepository.findById(id);
    if (!instrutor) {
      const err = new Error('Instrutor não encontrado');
      (err as any).statusCode = 404;
      throw err;
    }
    return instrutor;
  },

  async update(id: number, data: Partial<{ nome: string; email: string; telefone?: string; cref: string }>) {
    await this.findById(id);
    if (data.email) {
      const exists = await instrutorRepository.findByEmail(data.email);
      if (exists && exists.id !== id) {
        const err = new Error('Email já cadastrado');
        (err as any).statusCode = 409;
        throw err;
      }
    }
    if (data.cref) {
      const exists = await instrutorRepository.findByEmail(data.cref);
      if (exists && exists.id !== id) {
        const err = new Error('CREF já cadastrado');
        (err as any).statusCode = 409;
        throw err;
      }
    }
    return instrutorRepository.update(id, data);
  },

  async delete(id: number) {
    await this.findById(id);
    const modalidades = await modalidadeRepository.findByInstrutorId(id);
    if (modalidades.length > 0) {
      const err = new Error('Não é possível excluir instrutor com modalidades vinculadas');
      (err as any).statusCode = 409;
      throw err;
    }
    return instrutorRepository.delete(id);
  },
};