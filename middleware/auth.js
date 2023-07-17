import ErrorResponse from '../utils/errorResponse.js';
const jwt = require('jsonwebtoken');
import status from 'http-status';

const authRequest = (req, res, next) => {
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

		if (payload.accessLevel >= 30) {
			next();
		} else {
			throw new Error('Unauthorized Access Level');
		}
	} catch (err) {
		return next(new ErrorResponse('Unauthorized', status.BAD_REQUEST));
	}
};

module.exports = authRequest;
