import { GraphQLID, GraphQLNull, GraphQLList } from 'graphql';

// types
import UserType from '../types/user';
import ProjectType from '../types/project';

// Logic
import UserService from '../logic/users';


const userQueryFields = {
	userProfile: {
		type: UserType,
		description: 'Get user document for currently signed-in user',
		async resolve(obj, _, { token }) {
			const userService = new UserService(token);
			return await userService.getProfile();
		}
	}
};


export default userQueryFields;
