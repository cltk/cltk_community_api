import {
	GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString, GraphQLInt,
	GraphQLBoolean,
} from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Project from '../../models/project';

// logic
import FileService from '../logic/files';
import ItemService from '../logic/items';
import ProjectService from '../logic/projects';
import UserService from '../logic/users';
import PageService from '../logic/pages';

// types
import FileType from './file';
import ItemType from './item';
import UserType from './user';
import PageType from './page';


const config = {
	name: 'ProjectType',
	description: 'Project base query type',
	class: 'GraphQLObjectType',
	schema: Project.schema,
	extend: {
		page: {
			type: PageType,
			description: 'Get page document',
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
				const pageService = new PageService(token);
				return pageService.getPage({ projectId: parent._id, _id, slug, hostname });
			}
		},
		pages: {
			type: new GraphQLList(PageType),
			description: 'Get list of pages',
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
				const pageService = new PageService(token);
				return pageService.getPages({ projectId: parent._id, textsearch, limit, offset });
			}
		},
		pagesCount: {
			type: GraphQLInt,
			description: 'Get count of pages in project',
			resolve(parent, _, { token }) {
				const pageService = new PageService(token);
				return pageService.count({ projectId: parent._id });
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
				return itemService.getItem({ projectId: parent._id, _id, slug });
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
				return itemService.getItems({ projectId: parent._id, textsearch, limit, offset });
			}
		},
		itemsCount: {
			type: GraphQLInt,
			description: 'Get count of items in project',
			resolve(parent, _, { token }) {
				const itemService = new ItemService(token);
				return itemService.count({ projectId: parent._id });
			}
		},
		files: {
			type: new GraphQLList(FileType),
			description: 'Get project files',
			resolve(parent, args, { token }) {
				const fileService = new FileService(token);
				return fileService.getFiles({ projectId: parent._id });
			}
		},
		file: {
			type: FileType,
			description: 'Get a project file',
			args: {
				_id: {
					type: GraphQLString,
				},
			},
			resolve(parent, { _id }, { token }) {
				const fileService = new FileService(token);
				return fileService.getFile({ projectId: parent._id, _id });
			}
		},
		filesCount: {
			type: GraphQLInt,
			description: 'Count all project files',
			resolve(parent, args, { token }) {
				const fileService = new FileService(token);
				return fileService.count({ projectId: parent._id });
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
