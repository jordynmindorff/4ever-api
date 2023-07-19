import { client } from '../utils/db.js';
import status from 'http-status';
import ErrorResponse from '../utils/errorResponse.js';

export const getMemories = async (req, res, next) => {
	try {
		const { user: id } = req;
		const users = await client.query('SELECT * FROM public.user WHERE id=$1', [id]);

		return res.json({
			success: true,
			data: users.rows,
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};
