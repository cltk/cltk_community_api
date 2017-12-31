import jsonwebtoken from 'jsonwebtoken';

import Project from '../../models/project';
import User from '../../models/user';

export default class PermissionsService {

	constructor(token) {
		this.userId = null;
		this.userName = null;
		this.userAvatar = null;
		this.project = null;

		if (token !== 'null' && token) {
			this.token = token;
			const decoded = jsonwebtoken.decode(token);
			if (decoded) {
				this.userId = decoded.userId;
				this.userName = decoded.userName;
				this.userAvatar = decoded.userAvatar;
			}
		}
	}


	_getUserRoleForProject(project) {
		let userRoleForProject;

		// TODO add other roles
		// Right now only one role
		project.users.forEach((user) => {
			if (
				user.userId
				&& user.userId.toString() === this.userId
			) {
				userRoleForProject = user.role;
			}
		});

		return userRoleForProject;
	}

	userIsProjectAdmin(project) {
		return (this._getUserRoleForProject(project) === 'admin');
	}
}
