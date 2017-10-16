import { GraphQLID, GraphQLNonNull } from 'graphql';

// types
import ProjectType from '../types/models/project';

// models
import Project from '../../models/project';


const projectQueryFields = {
	project: {
		type: ProjectType,
		description: 'Get project document',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLID),
			},
		},
		resolve(project, { _id }, context) {
			return Project.findById(_id);
		}
	},
};

export default projectQueryFields;
