import express from 'express';

import { login, createAccount } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.route('/login').post(login);
authRouter.route('/signup').post(createAccount);

export default authRouter;
