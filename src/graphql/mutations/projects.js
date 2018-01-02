import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import ProjectType, { ProjectInputType } from '../types/project';
import RemoveType from '../types/remove';

// Logic
import ProjectService from '../logic/projects';


const projectMutationFields = {
	projectCreate: {
		type: ProjectType,
		description: 'Create a new project',
		args: {
			project: {
				type: new GraphQLNonNull(ProjectInputType)
			}
		},
		async resolve(parent, { project }, { token }) {
			const projectService = new ProjectService(token);
			return await projectService.create(project);
		},
	},

	projectUpdate: {
		type: ProjectType,
		description: 'Update project',
		args: {
			project: {
				type: new GraphQLNonNull(ProjectInputType),
			},
		},
		async resolve(parent, { project }, { token }) {
			const projectService = new ProjectService(token);
			return await projectService.update(project);
		}
	},

	projectRemove: {
		type: RemoveType,
		description: 'Remove project',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLString),
			},
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		async resolve (parent, { _id, hostname }, { token }) {
			const projectService = new ProjectService(token);
			return await projectService.remove(_id, hostname);
		},
	},
};

export default projectMutationFields;
