import express from 'express';

import { loginHandler, profileHandler, registerHandler, getUserHandler } from '../../controllers/auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validateRequestBody } from '../../validators';
import { loginSchema, registerSchema } from '../../validators/user.validator';

const authRouter = express.Router();

authRouter.post('/register', validateRequestBody(registerSchema), registerHandler);
authRouter.post('/login', validateRequestBody(loginSchema), loginHandler);
authRouter.get('/profile', requireAuth, profileHandler);
authRouter.get('/users/:id', getUserHandler); // internal endpoint for BookingService

export default authRouter;
