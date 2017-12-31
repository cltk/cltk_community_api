import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean } from 'graphql';

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
	},
	userInvite: {
		type: GraphQLBoolean,
		description: 'Invite a user',
		args: {
			userEmail: {
				type: GraphQLString,
				required: true,
			},
			role: {
				type: GraphQLString,
				required: true,
			},
			recaptchaVerification: {
				type: GraphQLString,
				required: true,
			},
			hostname: {
				type: GraphQLString,
				required: true,
			},
		},
		async resolve(obj, { userEmail, recaptchaVerification }, { token }) {
			const userService = new UserService(token);
			return await userService.invite({ userEmail, recaptchaVerification });
		}
	},
};

export default userMutationFields;
