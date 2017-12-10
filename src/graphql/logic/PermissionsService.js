import jsonwebtoken from 'jsonwebtoken';

import Project from '../../models/project';
import User from '../../models/user';

export default class PermissionsService {

	constructor(token) {
		this.userId;
		this.userName;
		this.userAvatar;
		this.project = null;

		if (token !== 'null' && token) {
			this.token = token;
			console.log(token);
			const decoded = jsonwebtoken.decode(token);
			console.log(decoded);
			if (decoded) {
				this.userId = decoded.user_id;
				this.userName = decoded.name;
				this.userAvatar = decoded.picture;
			}
		}
	}


	async _getUserRoleForProject(project) {
		let userRoleForProject;

		// TODO add other roles
		// Right now only one role
		const userIsAdmin = await project.validateUser(this.userId);
		if (userIsAdmin) {
			userRoleForProject = 'admin'
		}

		return userRoleForProject;
	}

	userIsProjectAdmin(project) {
		return this._getUserRoleForProject(project) === 'admin';
	}
}
