// models
import User from '../../models/user';

export const generateResetPassword = async (res, username) => {

	try {
		const user = await User.generatePasswordResetToken(username);
		if (user) {
			return res.json({ ok: true });
		}
		return res.json({ ok: false });
	} catch (err) {
		console.error('err', err);
		return res.status(500).send();
	}
};

export const resetPassword = async (res, resetPasswordToken, newPassword) => {

	try {
		const user = await User.resetPassword(resetPasswordToken, newPassword);
		if (user) {
			return res.json({ ok: true });
		}
		return res.json({ ok: false });
	} catch (err) {
		console.error('err', err);
		if (err.passwordStrength) return res.status(200).send(err);
		return res.status(500).send();
	}
};
