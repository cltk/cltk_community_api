import { createError } from 'apollo-errors';

/**
 * Authentication Error
 * @type {Error}
 */
export const AuthenticationError = createError('AuthenticationError', {
	message: 'User not identified',
});

/**
 * Permission / Authorization Error
 * @type {Error}
 */
export const PermissionError = createError('PermissionError', {
	message: 'User not authorized - permission denied',
});

/**
 * Project Error
 * @type {Error}
 */
export const ProjectError = createError('ProjectError', {
	message: 'Project not authorized - permission denied',
});

/**
 * Argument Error
 * @type {Error}
 */
export const ArgumentError = createError('ArgumentError', {
	message: 'Incorrect or missing value of an argument',
});

/**
 * Mongoose general Error
 * @type {Error}
 */
export const MongooseGeneralError = createError('MongooseGeneralError', {
	message: 'Mongoose error',
});


/**
 * Mongoose duplicate key Error
 * @type {Error}
 */
export const MongooseDuplicateKeyError = createError('MongooseDuplicateKeyError', {
	message: 'Mongoose duplicate key error',
});

/**
 * Mongoose validation Error
 * @type {Error}
 */
export const MongooseValidationError = createError('MongooseValidationError', {
	message: 'Mongoose model validation failed',
});

/**
 * Handel error returned by mongoose after operation
 * @param  {Error} err 	Error object
 */
export const handleMongooseError = (err) => {
	// handle duplicate key error
	if (err.name === 'MongoError' && err.code === 11000) {
		throw new MongooseDuplicateKeyError({
			data: {
				errmsg: err.errmsg
			}
		});
	}

	// handle validation errors
	if (err.errors) {
		throw new MongooseValidationError({
			data: err.errors,
		});
	}

	throw err;
};
