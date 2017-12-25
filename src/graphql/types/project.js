import {
	GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString, GraphQLInt,
	GraphQLBoolean,
} from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Project from '../../models/project';

// logic
import ProjectService from '../logic/projects';
import CollectionService from '../logic/collections';
import ItemService from '../logic/items';
import UserService from '../logic/users';

// types
import CollectionType from './collection';
import ItemType from './item';
import ActivityItemType from './activityItem';
import UserType from './user';


const config = {
	name: 'ProjectType',
	description: 'Project base query type',
	class: 'GraphQLObjectType',
	schema: Project.schema,
	extend: {
		collection: {
			type: CollectionType,
			description: 'Get collection document',
			args: {
				_id: {
					type: GraphQLString,
				},
				slug: {
					type: GraphQLString,
				},
				hostname: {
					type: GraphQLString,
				},
			},
			resolve(parent, { _id, slug, hostname }, { token }) {
				const collectionService = new CollectionService(token);
				return collectionService.getCollection({ projectId: parent._id, _id, slug, hostname });
			}
		},
		collections: {
			type: new GraphQLList(CollectionType),
			description: 'Get list of collections',
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			resolve(parent, { textsearch, limit, offset }, { token }) {
				const collectionService = new CollectionService(token);
				return collectionService.getCollections({ projectId: parent._id, textsearch, limit, offset });
			}
		},
		activity: {
			type: new GraphQLList(ActivityItemType),
			description: 'Get project activity',
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
			type: new GraphQLList(new GraphQLObjectType({
				name: 'ProjectUsersType',
				fields: {
					user: {
						type: UserType,
						resolve(projectUser, args, { token }) {
							const userService = new UserService(token);
							return userService.getUser({ _id: projectUser.userId });
						}
					},
					role: {
						type: GraphQLString,
					}
				}
			})),
			resolve(parent, args, { token }) {
				return parent.users;
			}
		},
		userIsAdmin: {
			type: GraphQLBoolean,
			resolve(parent, args, { token }) {
				const userService = new UserService(token);
				return userService.userIsAdmin({ project: parent });
			}
		},
		item: {
			type: ItemType,
			description: 'Get item document',
			args: {
				_id: {
					type: GraphQLString,
				},
				slug: {
					type: GraphQLString,
				},
			},
			resolve(parent, { _id, slug }, { token }) {
				const itemService = new ItemService(token);
				return itemService.getItem({ collectionId: parent._id, _id, slug });
			}
		},
		items: {
			type: new GraphQLList(ItemType),
			description: 'Get list of items',
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			resolve(parent, { textsearch, limit, offset }, { token }) {
				const itemService = new ItemService(token);
				return itemService.getItems({ collectionId: parent._id, textsearch, limit, offset });
			}
		},
	},
};

const configInput = {
	name: 'ProjectInputType',
	description: 'Project Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Project.schema,
	exclude: [],
};

const ProjectType = createType(config);
const ProjectInputType = createType(configInput);

export default ProjectType;
export { ProjectInputType };
