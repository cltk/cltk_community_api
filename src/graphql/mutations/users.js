import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import UserType from '../types/models/user';

import UserService from '../logic/UserService';

// models
import User from '../../models/user';

// errors
import { AuthenticationError } from '../errors';

const userMutationFields = {
	userUpdate: {
		type: UserType,
		description: 'Update user profile',
		args: {
			user: {
				type: UserType,
			}
		},
		async resolve(parent, { user }, context) {
			const userService = new UserService({token});
			return await userService.userUpdate(_id);
		}
	}
};

export default userMutationFields;
