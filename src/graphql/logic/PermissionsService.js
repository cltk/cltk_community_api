import Project from '../../models/project';
import User from '../../models/user';

export default class PermissionsService {

	constructor(_id) {
		this._id = _id;
		this.user = null;
		this.project = null;
		this.userRolesForProject = [];
	}

	hasRights(role, callback) {

		return new Promise((resolve, reject) => {

			this._checkRole(role).then(() => {

				if (typeof callback === 'function') {
					return callback('User is admin');
				}

				resolve('User is admin');

			}).catch((err) => {

				if (typeof callback === 'function') {
					return callback();
				}

				reject(err);

			});

		});

	}

	_checkRole(role) {

		return new Promise((resolve, reject) => {

			const staffLevel = PermissionsService._convertRole(role);

			User.findById(this._id, () => {

				if (!user) {
					return reject('User does not exist');
				}

				if (user.role < staffLevel) {
					reject('User role mismatch');
				}

				resolve('User role match');

			});
		});
	}

	static _convertRole(role) {

		if (role === 'admin') {
			return 3;
		} else if (role === 'editor') {
			return 2;
		} else if (role === 'subscriber') {
			return 1;
		}

		return 0;

	}


}
