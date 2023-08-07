import express from 'express';
import protect from '../middleware/auth.js';

import { login, createAccount, confirmSession } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.route('/login').post(login);
authRouter.route('/signup').post(createAccount);
authRouter.route('/confirmsession').post(protect, confirmSession);

export default authRouter;
