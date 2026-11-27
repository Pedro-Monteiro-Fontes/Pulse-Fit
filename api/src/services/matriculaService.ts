import { matriculaRepository } from '@/repositories/matriculaRepository';
import { alunoRepository } from '@/repositories/alunoRepository';
import { modalidadeRepository } from '@/repositories/modalidadeRepository';

export const matriculaService = {
  async create(data: { alunoId: number; modalidadeId: number; dataInicio?: Date; status?: string }) {
    const aluno = await alunoRepository.findById(data.alunoId);
    if (!aluno) {
      const err = new Error('Aluno não encontrado');
      (err as any).statusCode = 404;
      throw err;
    }
    const modalidade = await modalidadeRepository.findById(data.modalidadeId);
    if (!modalidade) {
      const err = new Error('Modalidade não encontrada');
      (err as any).statusCode = 404;
      throw err;
    }
    const exists = await matriculaRepository.findByAlunoAndModalidade(data.alunoId, data.modalidadeId);
    if (exists) {
      const err = new Error('Aluno já matriculado nesta modalidade');
      (err as any).statusCode = 409;
      throw err;
    }
    return matriculaRepository.create({
      ...data,
      dataInicio: data.dataInicio ?? new Date(),
      status: data.status ?? 'ativa',
    });
  },

  async findAll() {
    return matriculaRepository.findAll();
  },

  async findById(id: number) {
    const matricula = await matriculaRepository.findById(id);
    if (!matricula) {
      const err = new Error('Matrícula não encontrada');
      (err as any).statusCode = 404;
      throw err;
    }
    return matricula;
  },

  async updateStatus(id: number, status: string) {
    await this.findById(id);
    if (!['ativa', 'cancelada'].includes(status)) {
      const err = new Error('Status inválido');
      (err as any).statusCode = 400;
      throw err;
    }
    return matriculaRepository.update(id, { status });
  },

  async delete(id: number) {
    await this.findById(id);
    return matriculaRepository.delete(id);
  },
};