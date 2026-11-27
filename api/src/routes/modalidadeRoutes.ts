import { Router } from 'express';
import { modalidadeController } from '@/controllers/modalidadeController';
import { validate } from '@/middlewares/validarBody';
import { modalidadeCreateSchema, modalidadeUpdateSchema } from '@pulse-fit/shared';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate(modalidadeCreateSchema), modalidadeController.create);
router.get('/', modalidadeController.findAll);
router.get('/:id', modalidadeController.findById);
router.patch('/:id', validate(modalidadeUpdateSchema), modalidadeController.update);
router.delete('/:id', modalidadeController.delete);

export default router;