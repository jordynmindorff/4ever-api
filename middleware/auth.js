import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';
import status from 'http-status';
import { client } from '../utils/db.js';

const protect = async (req, res, next) => {
	const tokenSecret = process.env.TOKEN_SECRET;
	let authHeader = req.headers.authorization;

	try {
		if (!authHeader) {
			return next(new ErrorResponse('No Key Provided', status.UNAUTHORIZED));
		}

		if (authHeader.startsWith('Bearer ')) {
			authHeader = authHeader.slice(7, authHeader.length).trimLeft();
		} else {
			return next(new ErrorResponse('Invalid Token Format', status.BAD_REQUEST));
		}

		const payload = jwt.verify(authHeader, tokenSecret);
		const user = await client.query('SELECT * FROM public.user WHERE id=$1', [payload.id]);

		if (user.rows.length < 1) {
			return next(new ErrorResponse('User Not Found', status.NOT_FOUND));
		}

		// Store user id down request chain
		req.user = payload.id;

		// TODO Allow to pass accessLevel parameter to protect routes for admin access and such
		if (user.rows[0].access_level >= 0) {
			next();
		} else {
			throw new Error('Unauthorized Access Level');
		}
	} catch (err) {
		// ! I mean, could be server error, revisit this
		return next(new ErrorResponse('Unauthorized', status.BAD_REQUEST, err));
	}
};

export default protect;
