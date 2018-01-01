import {
	GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt,
} from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// types
import FileType, { FileInputType } from './file';
import MetadataType, { MetadataInputType } from './metadata';
import CommentType from './comment';
import ManifestType from './manifest';

// logic
import ItemService from '../logic/items';
import FileService from '../logic/files';
import CommentService from '../logic/comments';
import ManifestService from '../logic/manifests';

// models
import Item from '../../models/item';


const config = {
	name: 'ItemType',
	description: 'Item Schema base query type',
	class: 'GraphQLObjectType',
	schema: Item.schema,
	exclude: [],
	extend: {
		files: {
			type: new GraphQLList(FileType),
			description: 'Get item files',
			resolve(item, args, { token }) {
				const fileService = new FileService(token);
				return fileService.getFiles({ itemId: item._id });
			}
		},
		filesCount: {
			type: GraphQLInt,
			description: 'Count all item files',
			resolve(item, args, { token }) {
				const fileService = new FileService(token);
				return fileService.count({ itemId: item._id });
			}
		},
		comment: {
			type: CommentType,
			description: 'Get a comment ',
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
				const commentService = new CommentService(token);
				return commentService.getComment({ itemId: parent._id, _id, slug, hostname });
			}
		},
		comments: {
			type: new GraphQLList(CommentType),
			description: 'Get list of comments',
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
				const commentService = new CommentService(token);
				return commentService.getComments({ itemId: parent._id, textsearch, limit, offset });
			}
		},
		commentsCount: {
			type: GraphQLInt,
			description: 'Get count of comment for project',
			resolve(parent, _, { token }) {
				const commentService = new CommentService(token);
				return commentService.count({ itemId: parent._id });
			}
		},
		metadata: {
			type: new GraphQLList(MetadataType),
			description: 'Get item metadata',
			resolve(item, args, context) {
				return item.metadata;
			}
		},
		manifest: {
			type: ManifestType,
			description: 'Get a IIIF manifest for all image files associated with item',
			resolve(parent, _, { token }) {
				const manifestService = new ManifestService(token);
				return manifestService.getManifest({ itemId: parent._id, });
			}
		},
	},
};

const configInput = {
	name: 'ItemInputType',
	description: 'Item Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Item.schema,
	exclude: ['createdAt', 'updatedAt'],
	extend: {
		metadata: {
			type: new GraphQLList(MetadataInputType)
		},
	}
};

const ItemType = createType(config);
const ItemInputType = createType(configInput);

export default ItemType;
export { ItemInputType };
