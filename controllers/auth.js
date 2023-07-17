import ErrorResponse from '../utils/errorResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import status from 'http-status';

// @desc create an account
// @route POST /api/auth/signup
// @access Public
export const createAccount = async (req, res, next) => {
	try {
		const { username, password, email, birthday } = req.body;
		if (!username || !password || !email || !birthday) {
			return next(new ErrorResponse('Invalid Request', status.BAD_REQUEST));
		}

		const validity = await userValidationSchema.isValid(req.body);
		if (!validity) return next(new ErrorResponse('Invalid User Data', status.BAD_REQUEST));

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await AccessUser.create({
			username,
			password: hashedPassword,
			email,
			accessLevel: 0,
		});

		res.status(status.CREATED).json({
			success: true,
			data: {
				username: newUser.username,
				email: newUser.email,
				accessLevel: newUser.accessLevel,
			},
		});
	} catch (err) {
		if (err.code === 11000) {
			return next(new ErrorResponse('Already Exists', 400));
		} else {
			return next(new ErrorResponse('Server Error', 500));
		}
	}
};

// @desc login with username and password to receive JWT token to use for future requests
// @route POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
	try {
		const { password, email, username } = req.body;
		if (!password || (!email && !username)) {
			return next(new ErrorResponse('Insufficient Details Provided', 400));
		}

		if (username) {
			const accessUser = await AccessUser.findOne({ username });
			if (!accessUser) return next(new ErrorResponse('User Not Found', 404));

			const { _id, password: hashedPassword, accessLevel } = accessUser;

			const passwordValid = await bcrypt.compare(password, hashedPassword);

			if (passwordValid) {
				const accessToken = jwt.sign({ _id, accessLevel }, process.env.TOKEN_SECRET);
				return res.json({
					success: true,
					data: {
						token: accessToken,
						user: {
							username,
							_id,
							email,
							accessLevel,
						},
					},
				});
			} else {
				return next(new ErrorResponse('Access Denied', 401));
			}
		}

		if (email) {
			const accessUser = await AccessUser.findOne({ email });
			if (!accessUser) return next(new ErrorResponse('User Not Found', 404));

			const { _id, password: hashedPassword, username, accessLevel } = accessUser;

			const passwordValid = await bcrypt.compare(password, hashedPassword);

			if (passwordValid) {
				const accessToken = jwt.sign({ _id, accessLevel }, process.env.TOKEN_SECRET);
				res.json({
					success: true,
					data: {
						token: accessToken,
						user: {
							username,
							_id,
							email,
							accessLevel,
						},
					},
				});
			} else {
				return next(new ErrorResponse('Access Denied', 401));
			}
		}
	} catch (err) {
		return next(new ErrorResponse('Server Error', 500));
	}
};
