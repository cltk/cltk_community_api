import crypto from 'crypto';
import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

/**
 * User base schema
 * @type {Schema}
 */
const UserSchema = new Schema({
	username: String,
	name: String,
	email: String,
	bio: String,
	twitter: String,
	linkedIn: String,
	facebook: String,
	password: String,
	oauthIds: [{
		network: String,
		id: String,
	}],
	verified: {
		type: Boolean,
		defualt: false,
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

// add password hash and salt
UserSchema.plugin(passportLocalMongoose);

// add timestamp (createdAt, updatedAt)
UserSchema.plugin(timestamp);

// Statics
// // this method is needed for dataloader to work
UserSchema.statics.findById = function findById(_id, cb) {
	return User.findOne({ _id }, cb);
};

UserSchema.statics.findByOAuth = function findByOAuth(id, network, cb) {
	return User.findOne({ oauthIds: { $elemMatch: { network, id } } }, cb);
};

UserSchema.statics.createOAuth = async function createOAuth({ id, network }, cb) {
	const user = await User.findByOAuth(id, network);
	if (user) return null;
	return User.create({ oauthIds: [{ id, network }] }, cb);
};

UserSchema.statics.generatePasswordResetToken = async function generatePasswordResetToken(username) {
	try {
		const buf = await crypto.randomBytes(48);
		const token = buf.toString('hex');
		return User.findOneAndUpdate({ username }, {
			resetPasswordToken: token,
			resetPasswordExpires: Date.now() + 3600000, // 1 hour
		});
	} catch (err) {
		throw err;
	}
};

UserSchema.statics.resetPassword = async function resetPassword(resetPasswordToken, newPassword) {
	try {
		const user = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });
		if (user) {
			// second value must be passed - workaround for model bug
			return new Promise((resolve, reject) => {
				user.setPassword(newPassword, (err, userWithNewPassword) => {
					if (err) reject(err);
					userWithNewPassword.save((saveErr) => {
						if (saveErr) reject(saveErr);
						resolve(userWithNewPassword);
					});
				});
			});
		}
		return null;

	} catch (err) {
		throw err;
	}
};



/**
 * User mongoose model
 * @type {Object}
 */
const User = mongoose.model('User', UserSchema);

export default User;
export { UserSchema };
