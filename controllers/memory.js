import { client } from '../utils/db.js';
import status from 'http-status';
import ErrorResponse from '../utils/errorResponse.js';

// Util to check URL validity
const isValidUrl = (urlString) => {
	try {
		return Boolean(new URL(urlString));
	} catch (err) {
		console.log(err);
		return false;
	}
};

// @desc get all memories associated with a user account (body text not included)
// @route GET /v1/memory/
// @access PRIVATE
export const getMemories = async (req, res, next) => {
	try {
		const { user: id } = req;
		const memories = await client.query(
			'SELECT id, user_id, date, image_link FROM public.memory WHERE user_id=$1',
			[id]
		);

		return res.json({
			success: true,
			data: memories.rows,
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};

// @desc get single memory with full detail
// @route GET /v1/memory/:memoryId
// @access PRIVATE
export const getMemory = async (req, res, next) => {
	try {
		const { memoryId } = req.params;
		const { user: id } = req;

		if (!memoryId)
			return next(new ErrorResponse('Missing Required Fields', status.BAD_REQUEST));

		const memory = await client.query(
			'SELECT * FROM public.memory WHERE user_id=$1 AND id=$2',
			[id, memoryId]
		);

		if (memory.rows.length < 1)
			return next(new ErrorResponse('Memory Not Found', status.NOT_FOUND));

		return res.json({
			success: true,
			data: memory.rows[0],
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};

// @desc create a new memory associated with the user account
// @route POST /v1/memory/
// @access PRIVATE
export const createMemory = async (req, res, next) => {
	try {
		const { date, bodyText, imageURL } = req.body;
		const { user: id } = req;

		if (!date || !bodyText || !imageURL)
			return next(new ErrorResponse('Missing Required Fields', status.BAD_REQUEST));

		if (!isValidUrl(imageURL))
			return next(new ErrorResponse('Improper Image URL', status.BAD_REQUEST));

		const newMemory = await client.query(
			'INSERT INTO public.memory (user_id, date, body, image_link) VALUES ($1, $2, $3, $4) RETURNING *',
			[id, date, bodyText, imageURL]
		);

		return res.status(status.CREATED).json({
			success: true,
			data: newMemory.rows[0],
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};

// @desc delete a memory
// @route DELETE /v1/memory/:memoryId
// @access PRIVATE
export const deleteMemory = async (req, res, next) => {
	try {
		const { memoryId } = req.params;
		const { user: id } = req;

		if (!memoryId)
			return next(new ErrorResponse('Missing Required Fields', status.BAD_REQUEST));

		const check = await client.query('SELECT * FROM public.memory WHERE user_id=$1 AND id=$2', [
			id,
			memoryId,
		]);

		if (check.rows.length < 1)
			return next(new ErrorResponse('Memory Not Found', status.NOT_FOUND));

		await client.query('DELETE FROM public.memory WHERE user_id=$1 AND id=$2', [id, memoryId]);

		return res.json({
			success: true,
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};

// @desc update a memory
// @route PATCH /v1/memory/:memoryId
// @access PRIVATE
export const updateMemory = async (req, res, next) => {
	try {
		const { memoryId } = req.params;
		const { user: id } = req;

		if (!memoryId)
			return next(new ErrorResponse('Missing Required Fields', status.BAD_REQUEST));

		const check = await client.query('SELECT * FROM public.memory WHERE user_id=$1 AND id=$2', [
			id,
			memoryId,
		]);

		if (check.rows.length < 1)
			return next(new ErrorResponse('Memory Not Found', status.NOT_FOUND));

		const updatedDate = req.body.date ? req.body.date : check.rows[0].date;
		const updatedImage = req.body.imageURL ? req.body.imageURL : check.rows[0].image_link;
		const updatedBody = req.body.bodyText ? req.body.bodyText : check.rows[0].body;

		const updated = await client.query(
			'UPDATE public.memory SET date=$1, image_link=$2, body=$3 WHERE user_id=$4 AND id=$5 RETURNING *',
			[updatedDate, updatedImage, updatedBody, id, memoryId]
		);

		return res.json({
			success: true,
			data: updated.rows,
		});
	} catch (err) {
		next(new ErrorResponse('Server Error', status.INTERNAL_SERVER_ERROR, err));
	}
};
