import status from 'http-status';

const handle404 = (req, res, next) => {
	res.status(status.NOT_FOUND).json({
		success: false,
		msg: 'Route not found.',
	});
};

export default handle404;
