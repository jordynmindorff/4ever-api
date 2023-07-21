import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middleware/error.js';
import handle404 from './middleware/404Handle.js';
import 'dotenv/config';
import { connect } from './utils/db.js';

// Routers
import authRouter from './routes/authRoutes.js';
import memoriesRouter from './routes/memoryRoutes.js';

// Connect to DB
connect();

// Initialize API
const app = express();

// CORS Handling
app.use(cors());

// Basic HTTP Header Protection
app.use(helmet());

// Body Parser
app.use(express.json());

// Mount router for authentication routes
app.use('/v1/auth', authRouter);

// Mount router for authentication routes
app.use('/v1/memory', memoriesRouter);

// Error handler middleware
app.use(errorHandler);

// Handle 404s
app.use(handle404);

const PORT = process.env.PORT || 1818;

const server = app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}!`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Unhandled Error: ${err.message}`);
});
