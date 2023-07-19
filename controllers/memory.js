import { client } from '../utils/db.js';
import status from 'http-status';
import ErrorResponse from '../utils/errorResponse.js';

// @desc get all memories associated with a user account
// @route GET /v1/memory/
// @access PRIVATE
export const getMemories = async (req, res, next) => {
	try {
		const { user: id } = req;
		const memories = await client.query('SELECT * FROM public.memory WHERE user_id=$1', [id]);

		return res.json({
			success: true,
			data: memories.rows,
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};
