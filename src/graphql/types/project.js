import { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// logic
import ProjectService from '../logic/projects';

// models
import Project from '../../models/project';
import Collection from '../../models/collection';

// types
import CollectionType from './collection';
import ActivityItemType from './activityItem';
import UserType from './user';


const config = {
	name: 'ProjectType',
	description: 'Project base query type',
	class: 'GraphQLObjectType',
	schema: Project.schema,
	extend: {
		collections: {
			type: new GraphQLList(CollectionType),
			description: 'Get all project collection',
			resolve(parent, { limit, offset }, { token }) {
				const projectService = new ProjectService(token);
				return projectService.getCollections({
					projectId: parent._id,
					limit,
					offset,
				});
			}
		},
		activity: {
			type: new GraphQLList(ActivityItemType),
			description: 'Get all project collection',
			resolve(parent, { limit, offset }, { token }) {
				const projectService = new ProjectService(token);
				return projectService.getActivityFeed({
					projectId: parent._id,
					limit,
					offset,
				});
			}
		},
		users: {
			type: new GraphQLObjectType({
				name: 'ProjectUsersType',
				fields: {
					user: {
						type: UserType,
						resolve(projectUser, args, context) {
							return User.findById(projectUser.userId);
						}
					},
					role: {
						type: GraphQLString,
					}
				}
			}),
			resolve(parent, args, { token }) {
				return project.users;
			}
		},
	},
};

const configInput = {
	name: 'ProjectInputType',
	description: 'Project Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Project.schema,
	exclude: ['_id', 'slug', 'createdAt', 'updatedAt'],
};

const ProjectType = createType(config);
const ProjectInputType = createType(configInput);

export default ProjectType;
export { ProjectInputType };
