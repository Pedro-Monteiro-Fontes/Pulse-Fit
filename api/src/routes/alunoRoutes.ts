import { Router } from 'express';
import { alunoController } from '@/controllers/alunoController';
import { validate } from '@/middlewares/validarBody';
import { alunoCreateSchema, alunoUpdateSchema } from '@pulse-fit/shared';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate(alunoCreateSchema), alunoController.create);
router.get('/', alunoController.findAll);
router.get('/:id', alunoController.findById);
router.patch('/:id', validate(alunoUpdateSchema), alunoController.update);
router.delete('/:id', alunoController.delete);

export default router;