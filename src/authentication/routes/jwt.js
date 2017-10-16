import jwt from 'jsonwebtoken';

/**
 * Generate JWT token based on user object.
 * @param  {Object} user 	User object
 * @return {Object}      	Response object
 */
const generateJWT = (user) => {
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	return { success: true, token: `JWT ${token}`, username: user.username, userId: user._id };
};

export default generateJWT;
