import generateJWT from './jwt';
import providers from './providers';

// models
import User from '../../models/user';

// authentication
import { validateTokenOAuth1, validateTokenOAuth2 } from '../../authentication';

// email
import OrpheusEmail from '../../email';


export const registerPWD = (res, username, password) => {
	User.register(new User({
		username,
	}), password, (err, account) => {
		if (err) {
			return res.status(200).send(err);
		}
		const user = { _id: account._id };

		// send verification email
		OrpheusEmail.sendVerificationEmail(username);

		return res.json(generateJWT(user));
	});
};

export const registerOAuth2 = async (res, accessToken, network) => {
	try {
		const { url, userIdField } = providers[network];
		const profile = await validateTokenOAuth2(accessToken, url);
		if (profile) {
			const newUser = await User.createOAuth({ network, id: profile[userIdField] });
			if (newUser) {
				return res.json(generateJWT(newUser));
			}
			const user = await User.findByOAuth(profile[userIdField], network);
			if (user) {
				return res.json(generateJWT(user));
			}
		}
		return res.status(401).send({error: 'User not found'});
	} catch (err) {
		console.error('err', err);
		res.status(500).send();
	}
};

export const registerOAuth1 = async (res, oauthToken, oauthTokenSecret, network) => {
	try {
		const { url, userIdField } = providers[network];
		const profile = await validateTokenOAuth1(network, oauthToken, oauthTokenSecret, url);
		if (profile) {
			const newUser = await User.createOAuth({ network, id: profile[userIdField] });
			if (newUser) {
				return res.json(generateJWT(newUser));
			}
			const user = await User.findByOAuth(profile[userIdField], network);
			if (user) {
				return res.json(generateJWT(user));
			}
		}
		return res.status(401).send({error: 'User not found'});
	} catch (err) {
		console.error('err', err);
		res.status(500).send();
	}
};
