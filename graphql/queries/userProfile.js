import { GraphQLID, GraphQLNull } from 'graphql';

// types
import UserType from '../types/models/user';

// models
import User from '../../models/user';

const userProfileQueryFields = {
	userProfile: {
		type: UserType,
		description: 'Get user document for currently signed-in user',
		resolve(obj, args, context) {
			return User.findById(context.user._id);
		}
	}
};

export default userProfileQueryFields;
