import bcrypt from 'bcrypt';
import { usuarioRepository } from '@/repositories/usuarioRepository';
import { signToken, JwtPayload } from '@/config/jwt';

export const authService = {
  async register(data: { nome: string; email: string; senha: string }) {
    const exists = await usuarioRepository.findByEmail(data.email);
    if (exists) {
      const err = new Error('Email já cadastrado');
      (err as any).statusCode = 409;
      throw err;
    }
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const user = await usuarioRepository.create({
      nome: data.nome,
      email: data.email,
      senhaHash,
    });
    const token = signToken({ sub: String(user.id), email: user.email, role: 'admin' });
    return { user: { id: user.id, nome: user.nome, email: user.email }, token };
  },

  async login(data: { email: string; senha: string }) {
    const user = await usuarioRepository.findByEmail(data.email);
    if (!user) {
      const err = new Error('Credenciais inválidas');
      (err as any).statusCode = 401;
      throw err;
    }
    const valid = await bcrypt.compare(data.senha, user.senhaHash);
    if (!valid) {
      const err = new Error('Credenciais inválidas');
      (err as any).statusCode = 401;
      throw err;
    }
    const token = signToken({ sub: String(user.id), email: user.email, role: 'admin' });
    return { user: { id: user.id, nome: user.nome, email: user.email }, token };
  },

  async me(userId: string) {
    const user = await usuarioRepository.findById(parseInt(userId));
    if (!user) {
      const err = new Error('Usuário não encontrado');
      (err as any).statusCode = 404;
      throw err;
    }
    return { id: user.id, nome: user.nome, email: user.email };
  },
};