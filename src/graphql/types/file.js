import { GraphQLList, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import File from '../../models/file';

// logic
import ItemService from '../logic/items';

// types
import ItemType from './item';


const config = {
	name: 'FileType',
	description: 'File Schema base query type',
	class: 'GraphQLObjectType',
	schema: File.schema,
};

const configInput = {
	name: 'FileInputType',
	description: 'File Schema base input type',
	class: 'GraphQLInputObjectType',
	schema: File.schema,
	exclude: ['createdAt', 'updatedAt'],
};

const FileType = createType(config);
const FileInputType = createType(configInput);

export default FileType;
export { FileInputType };
