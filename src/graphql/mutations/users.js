import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import UserType, { UserInputType } from '../types/user';
import RemoveType from '../types/remove';

// Logic
import UserService from '../logic/users';


const userMutationFields = {
	userUpdate: {
		type: UserType,
		description: 'Update user profile',
		args: {
			user: {
				type: UserInputType,
			}
		},
		async resolve(obj, { user }, { token }) {
			const userService = new UserService(token);
			return await userService.update(user);
		}
	}
};

export default userMutationFields;
