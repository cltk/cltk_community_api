import { GraphQLID, GraphQLNull, GraphQLList } from 'graphql';

// types
import UserType from '../types/user';
import ProjectType from '../types/user';

// Logic
import UserService from '../logic/users';


const userQueryFields = {
	userProfile: {
		type: UserType,
		description: 'Get user document for currently signed-in user',
		async resolve(obj, {}, { token }) {
			const userService = new UserService(token);
			return await userService.getProfile();
		}
	},
	userProjects: {
		type: new GraphQLList(ProjectType),
		description: 'Get users associated with currently signed-in user',
		async resolve(obj, {}, { token }) {
			const userService = new UserService(token);
			return await userService.getProjects();
		}
	}
};


export default userQueryFields;
