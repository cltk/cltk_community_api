export default class PermissionsService {
	constructor(props) {
		this.user = props.user ? props.user : null;

		console.log("Permissions Service user and project", user, project);
		this.userRolesForProject = [];
	}
}
