import jwt from 'jsonwebtoken';

/**
 * Generate JWT token based on user object.
 * @param  {Object} user 	User object
 * @return {Object}      	Response object
 */
const generateJWT = (user) => {
	const token = jwt.sign({
		userId: user._id,
		userName: user.name,
		userAvatar: user.avatar,
		exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
	}, process.env.JWT_SECRET);
	return { success: true, token: `JWT ${token}`, username: user.username, userId: user._id };
};

export default generateJWT;
