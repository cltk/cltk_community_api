import express from 'express';

import { loginPWD, loginOAuth1, loginOAuth2 } from './login';
import { registerPWD, registerOAuth1, registerOAuth2 } from './register';
import { generateResetPassword, resetPassword } from './resetPassword';

// authentication
import { jwtAuthenticate } from '../../authentication';

const router = express.Router();

router.post('/login', (req, res) => {

	const { username, password, network, accessToken, oauthToken, oauthTokenSecret } = req.body;

	if (username && password) return loginPWD(res, username, password);

	if (accessToken && network) return loginOAuth2(res, accessToken, network);

	if (oauthToken && oauthTokenSecret && network) return loginOAuth1(res, oauthToken, oauthTokenSecret, network);

	return res.status(400);
});

router.post('/register', (req, res) => {

	const { username, password, network, accessToken, oauthToken, oauthTokenSecret } = req.body;

	if (username && password) return registerPWD(res, username, password);

	if (accessToken) return registerOAuth2(res, accessToken, network);

	if (oauthToken && oauthTokenSecret && network) return registerOAuth1(res, oauthToken, oauthTokenSecret, network);

	return res.status(400);
});

router.post('/verify-token', jwtAuthenticate, (req, res) => {

	if (req.user) return res.json(req.user);

	return res.status(401).send({error: 'User not found'});
});

router.post('/generate-reset-token', (req, res) => {

	const { username } = req.body;

	if (username) {
		return generateResetPassword(res, username);
	}

	return res.status(400).send('Username is required');
});

router.post('/reset-password', async (req, res) => {

	const { resetPasswordToken, newPassword } = req.body;

	if (resetPasswordToken && newPassword) {
		return resetPassword(res, resetPasswordToken, newPassword);
	}

	return res.status(400).send('Reset password token and new password is required');

});

export default router;
