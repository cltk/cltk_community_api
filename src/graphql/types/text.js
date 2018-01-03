import { GraphQLList, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Text from '../../models/text';

const config = {
	name: 'TextType',
	description: 'Text Schema base query type',
	class: 'GraphQLObjectType',
	schema: Text.schema,
};

const configInput = {
	name: 'TextInputType',
	description: 'Text Schema base input type',
	class: 'GraphQLInputObjectType',
	schema: Text.schema,
	exclude: ['createdAt', 'updatedAt'],
};

const TextType = createType(config);
const TextInputType = createType(configInput);

export default TextType;
export { TextInputType };
