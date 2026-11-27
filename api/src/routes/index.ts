import { Router } from 'express';
import instrutorRoutes from './instrutorRoutes';
import modalidadeRoutes from './modalidadeRoutes';
import alunoRoutes from './alunoRoutes';
import matriculaRoutes from './matriculaRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/instrutores', instrutorRoutes);
router.use('/modalidades', modalidadeRoutes);
router.use('/alunos', alunoRoutes);
router.use('/matriculas', matriculaRoutes);
router.use('/auth', authRoutes);

export default router;