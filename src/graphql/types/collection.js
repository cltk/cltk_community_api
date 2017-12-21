import { GraphQLList, GraphQLInt, GraphQLString, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Collection from '../../models/collection';

// logic
import CollectionService from '../logic/collections';
import ItemService from '../logic/items';

// types
import ItemType, { ItemInputType } from './item';


const config = {
	name: 'CollectionType',
	description: 'Collection base query type',
	class: 'GraphQLObjectType',
	schema: Collection.schema,
	exclude: [],
	extend: {
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
				hostname: {
					type: GraphQLString,
				},
			},
			resolve(parent, { _id, slug, hostname }, { token }) {
				const itemService = new ItemService(token);
				return itemService.getItem({ collectionId: parent._id, _id, slug, hostname });
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
	}
};

const configInput = {
	name: 'CollectionInputType',
	description: 'Collection Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Collection.schema,
	exclude: ['_id', 'slug', 'createdAt', 'updatedAt'],
	extend: {
		items: {
			type: new GraphQLList(ItemInputType),
		},
	}
};

const CollectionType = createType(config);
const CollectionInputType = createType(configInput);

export default CollectionType;
export { CollectionInputType };
