import { GraphQLObjectType, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
	name: 'RemoveType',
	fields: {
		result: {
			type: GraphQLBoolean,
		},
	},
});
