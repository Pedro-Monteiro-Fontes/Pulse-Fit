import { Router } from 'express';
import { instrutorController } from '@/controllers/instrutorController';
import { validate } from '@/middlewares/validarBody';
import { instrutorCreateSchema, instrutorUpdateSchema } from '@pulse-fit/shared';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate(instrutorCreateSchema), instrutorController.create);
router.get('/', instrutorController.findAll);
router.get('/:id', instrutorController.findById);
router.patch('/:id', validate(instrutorUpdateSchema), instrutorController.update);
router.delete('/:id', instrutorController.delete);

export default router;