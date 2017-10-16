import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import UserType from '../types/models/user';

import { RemoveType } from '../types';

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
		async resolve(obj, { user }, context) {
			// if user is not logged in
			if (!user) throw new AuthenticationError();

			const FoundUser = await User.findById(context.user._id);

			Object.keys(user).forEach((key) => {
				FoundItem[key] = user[key];
			});

			try {
				return await FoundUser.save();
			} catch (err) {
				handleMongooseError(err);
			}
		}
	}
};
