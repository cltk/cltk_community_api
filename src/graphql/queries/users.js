import { GraphQLID, GraphQLNull, GraphQLList } from 'graphql';

// types
import UserType from '../types/user';
import ProjectType from '../types/project';

// models
import Project from '../../models/project';
import User from '../../models/user';

const userQueryFields = {
	userProfile: {
		type: UserType,
		description: 'Get user document for currently signed-in user',
		resolve(obj, args, context) {
			return User.findById(context.user._id);
		}
	},
	userProjects: {
		type: new GraphQLList(ProjectType),
		description: 'Get projects associated with user',
		resolve(obj, arg, context) {
			return Project.find(
				{ users:
					{ $elemMatch: { userId: context.user._id } }
				},
				function callback(err, project) {
					if (err) throw err;
				}
			);
		}
	}
};


export default userQueryFields;
