import { GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Item from '../../models/item';
import File from '../../models/file';

// types
import FileType, { FileInputType } from './file';
import MetadataType, { MetadataInputType } from './metadata';


const config = {
	name: 'ItemType',
	description: 'Item Schema base query type',
	class: 'GraphQLObjectType',
	schema: Item.schema,
	exclude: [],
	extend: {
		files: {
			type: new GraphQLList(FileType),
			description: 'Get all item files',
			resolve(item, args, context) {
				return File.getByItemId(item._id);
			}
		},
		metadata: {
			type: new GraphQLList(MetadataType),
			description: 'Get all metadata',
			resolve(item, args, context) {
				return item.metadata;
			}
		},
	}
};

const configInput = {
	name: 'ItemInputType',
	description: 'Item Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Item.schema,
	exclude: ['_id', 'slug', 'createdAt', 'updatedAt'],
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
