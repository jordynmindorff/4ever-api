import { client } from '../utils/db.js';
import status from 'http-status';

export const getMemories = async (req, res, next) => {
	const users = await client.query('SELECT * FROM users');
	return res.json({
		success: true,
		data: users.rows,
	});
};
