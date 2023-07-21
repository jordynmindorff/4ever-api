import express from 'express';
import protect from '../middleware/auth.js';

import { getMemories, createMemory, deleteMemory } from '../controllers/memory.js';

const memoriesRouter = express.Router();

memoriesRouter
	.route('/')
	.get(protect, getMemories)
	.post(protect, createMemory)
	.delete(protect, deleteMemory);

export default memoriesRouter;
