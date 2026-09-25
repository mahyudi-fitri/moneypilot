import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { register, login, logout, me } from './auth.controller.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
