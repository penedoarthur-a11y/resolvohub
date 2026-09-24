import logger from '../utils/logger.js';
import { NodeEnv } from '../constants/common.js';

const errorMiddleware = (err, req, res, next) => {
	logger.error(err.message, err.stack);

	if (res.headersSent) {
		return next(err);
	}

	// Errors that carry a 4xx status (e.g. 401/403 from pocketbaseAuth) are meant for the
	// user, so keep their status and message instead of masking them as a generic 500.
	const isClientError = Number.isInteger(err.status) && err.status >= 400 && err.status < 500;

	res.status(isClientError ? err.status : 500).json({
		message: isClientError ? err.message : 'Algo deu errado!',
		...(process.env.NODE_ENV !== NodeEnv.Production && {
			error: {
				name: err.name,
				message: err.message,
				stack: err.stack,
			},
		}),
	});
};

export default errorMiddleware;
export { errorMiddleware };
