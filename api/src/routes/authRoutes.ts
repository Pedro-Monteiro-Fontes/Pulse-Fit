import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { validate } from '@/middlewares/validarBody';
import { usuarioCreateSchema, usuarioLoginSchema } from '@pulse-fit/shared';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.post('/register', validate(usuarioCreateSchema), authController.register);
router.post('/login', validate(usuarioLoginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;