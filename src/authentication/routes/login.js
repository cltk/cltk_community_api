import generateJWT from './jwt';
import providers from './providers';

// models
import User from '../../models/user';

// authentication
import { validateTokenOAuth1, validateTokenOAuth2 } from '../../authentication';

/**
 * Login user with password and username
 * @param  {Object} res      Express response object
 * @param  {String} username Username
 * @param  {String} password Password
 */
export const loginPWD = async (res, username, password) => {
	const user = await User.findByUsername(username);
	if (user) {
		user.authenticate(password, (_, isValid, message) => {
			if (isValid) {
				return res.json(generateJWT(user));
			}
			return res.status(401).send(message);
		});
	} else {
		return res.status(401).send({error: 'User not found'});
	}
};

/**
 * Login with OAuth v.2
 * @param  {Object} res      	Express response object
 * @param  {String} accessToken oAuth access token
 * @param  {String} network     Name of network (e.g. facebook)
 */
export const loginOAuth2 = async (res, accessToken, network) => {

	try {
		const { url, userIdField } = providers[network];
		const profile = await validateTokenOAuth2(accessToken, url);
		const user = await User.findByOAuth(profile[userIdField], network);
		if (user) {
			return res.json(generateJWT(user));
		}
		return res.status(401).send({error: 'User not found'});
	} catch (err) {
		console.log('err', err);
		res.status(500).send();
	}
};

/**
 * Login with OAuth v.1
 * @param  {Object} res      	Express response object
 * @param  {[type]} oauthToken       oAuth access token
 * @param  {[type]} oauthTokenSecret oAuth access secret
 * @param  {String} network     Name of network (e.g. facebook)
 */
export const loginOAuth1 = async (res, oauthToken, oauthTokenSecret, network) => {

	try {
		const { url, userIdField } = providers[network];
		const profile = await validateTokenOAuth1(network, oauthToken, oauthTokenSecret, url);
		const user = await User.findByOAuth(profile[userIdField], network);
		if (user) {
			return res.json(generateJWT(user));
		}
		return res.status(401).send({error: 'User not found'});
	} catch (err) {
		console.log('err', err);
		res.status(500).send();
	}
};
