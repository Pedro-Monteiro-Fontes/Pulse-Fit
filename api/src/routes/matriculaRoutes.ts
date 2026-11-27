import { Router } from 'express';
import { matriculaController } from '@/controllers/matriculaController';
import { validate } from '@/middlewares/validarBody';
import { matriculaCreateSchema, matriculaUpdateSchema } from '@pulse-fit/shared';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate(matriculaCreateSchema), matriculaController.create);
router.get('/', matriculaController.findAll);
router.get('/:id', matriculaController.findById);
router.patch('/:id/status', validate(matriculaUpdateSchema), matriculaController.updateStatus);
router.delete('/:id', matriculaController.delete);

export default router;