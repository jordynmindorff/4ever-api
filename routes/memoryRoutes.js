import express from 'express';
import protect from '../middleware/auth.js';

import { getMemories } from '../controllers/memory.js';

const memoriesRouter = express.Router();

memoriesRouter.route('/').get(protect, getMemories);

export default memoriesRouter;
