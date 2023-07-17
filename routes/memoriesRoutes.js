import express from 'express';

import { getMemories } from '../controllers/memories.js';

const memoriesRouter = express.Router();

memoriesRouter.route('/').get(getMemories);

export default memoriesRouter;
