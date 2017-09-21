import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';

// types
import UserType from '../types/models/user';

import { RemoveType } from '../types';
import { ExampleInputType } from '../types/models/example';

// models
import Example from '../../models/example';

// errors
import { AuthenticationError } from '../errors';

const exampleMutationFields = {
	exampleUpdate: {
		type: UserType,
		description: 'Example mutation',
		args: {
			_id: {
				type: GraphQLID,
			},
			example: {
				type: ExampleInputType
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

export default exampleMutationFields;
