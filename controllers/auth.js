import ErrorResponse from '../utils/errorResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import status from 'http-status';
import UserSchema from '../validation/UserValidationSchema.js';
import { client } from '../utils/db.js';

// @desc create an account
// @route POST /v1/auth/signup
// @access Public
export const createAccount = async (req, res, next) => {
	try {
		let { username, password, email, birthday } = req.body;
		username = username.toLowerCase();
		email = email.toLowerCase();

		// TODO return specific invalid fields/requirements in response (look at validate function instead of isValid)
		const validity = await UserSchema.isValid(req.body);
		if (!validity) return next(new ErrorResponse('Invalid User Data', status.BAD_REQUEST));

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const alreadyExistsCheck = await client.query(
			'SELECT * FROM public.user WHERE username=$1 OR email=$2',
			[username, email]
		);

		// TODO which is it?
		if (alreadyExistsCheck.rows.length > 0) {
			return next(
				new ErrorResponse(
					'User with Same Email or Username Already Exists',
					status.BAD_REQUEST
				)
			);
		}

		const creation = await client.query(
			'INSERT INTO public.user (username, email, password, birthday, access_level) VALUES ($1, $2, $3, $4, 0) RETURNING *',
			[username, email, hashedPassword, birthday]
		);

		delete creation.rows[0].password;

		return res.status(status.CREATED).json({
			success: true,
			data: creation.rows[0],
		});
	} catch (err) {
		console.log(err);
		return next(new ErrorResponse('Server Error', 500));
	}
};

// @desc login with username and password to receive JWT token to use for future requests
// @route POST /v1/auth/login
// @access Public
export const login = async (req, res, next) => {
	try {
		let { password, email, username } = req.body;
		if (!password || (!email && !username)) {
			return next(new ErrorResponse('Insufficient Details Provided', 400));
		}

		if (username) {
			username = username.toLowerCase();
			const user = await client.query('SELECT * FROM public.user WHERE username=$1', [
				username,
			]);
			if (user.rows.length < 1) return next(new ErrorResponse('User Not Found', 404));

			const { id, password: hashedPassword, access_level } = user.rows[0];

			const passwordValid = await bcrypt.compare(password, hashedPassword);

			if (passwordValid) {
				// ! Don't include mutable data in a JWT payload, that's bad. What if they update email/username and then try to authenticate with the key? Stick to id.
				const accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET);
				return res.json({
					success: true,
					data: {
						token: accessToken,
						user: {
							username,
							id,
							email,
							access_level,
						},
					},
				});
			} else {
				return next(new ErrorResponse('Access Denied', status.UNAUTHORIZED));
			}
		}

		if (email) {
			email = email.toLowerCase();

			const user = await client.query('SELECT * FROM public.user WHERE email=$1', [email]);
			if (user.rows.length < 1) return next(new ErrorResponse('User Not Found', 404));

			const { id, password: hashedPassword, username, access_level } = user;

			const passwordValid = await bcrypt.compare(password, hashedPassword);

			if (passwordValid) {
				const accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET);
				res.json({
					success: true,
					data: {
						token: accessToken,
						user: {
							username,
							_id,
							email,
							access_level,
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
