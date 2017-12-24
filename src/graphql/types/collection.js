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
		itemsCount: {
			type: GraphQLInt,
			description: 'Get count of items in collection',
			resolve(parent, _, { token }) {
				const itemService = new ItemService(token);
				return itemService.count({ collectionId: parent._id });
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
	exclude: [],
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
