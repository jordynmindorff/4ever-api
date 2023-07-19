import status from 'http-status';

const errorHandler = (err, req, res, next) => {
	// Log to console for dev
	console.log(err);
	console.log(
		err.originalError
			? 'ORIGINAL STACK TRACE: ' + err.originalError
			: 'Error Thrown Intentionally'
	); // Mainly for debugging purposes

	res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
		success: false,
		msg: err.message || 'Server Error',
	});
};

export default errorHandler;
