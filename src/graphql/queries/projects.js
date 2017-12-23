import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';

// types
import ProjectType from '../types/project';

// Logic
import ProjectService from '../logic/projects';


const projectQueryFields = {
	project: {
		type: ProjectType,
		description: 'Get project document',
		args: {
			_id: {
				type: GraphQLString,
			},
			slug: {
				type: GraphQLString,
			},
		},
		resolve(parent, { _id, slug }, { token, hostname }) {
			const projectService = new ProjectService(token);
			return projectService.getProject({ _id, slug, hostname });
		}
	},
	checkProjectAvailability: {
		type: ProjectType,
		description: 'Check if project hostname is available',
		args: {
			hostname: {
				type: GraphQLString,
			},
		},
		resolve(parent, { hostname }, { token }) {
			const projectService = new ProjectService(token);
			return projectService.getProject({ hostname });
		}
	},
	projects: {
		type: new GraphQLList(ProjectType),
		description: 'Get list of projects',
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		resolve(parent, { limit, offset }, { token }) {
			const projectService = new ProjectService(token);
			return projectService.getProjects({ limit, offset });
		}
	},
	userProjects: {
		type: new GraphQLList(ProjectType),
		description: 'Get list of projects that a user belongs to',
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		resolve(parent, { limit, offset }, { token }) {
			const projectService = new ProjectService(token);
			return projectService.getUserProjects({ limit, offset });
		}
	},
};

export default projectQueryFields;
