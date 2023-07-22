import express from 'express';
import protect from '../middleware/auth.js';

import { getMemories, createMemory, deleteMemory, updateMemory } from '../controllers/memory.js';

const memoriesRouter = express.Router();

memoriesRouter
	.route('/')
	.get(protect, getMemories)
	.post(protect, createMemory)
	.delete(protect, deleteMemory);

memoriesRouter.route('/:memoryId').delete(protect, deleteMemory).patch(protect, updateMemory);

export default memoriesRouter;
