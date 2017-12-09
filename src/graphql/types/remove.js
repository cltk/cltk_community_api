import { GraphQLObjectType, GraphQLID } from 'graphql';

export default new GraphQLObjectType({
	name: 'RemoveType',
	fields: {
		_id: {
			type: GraphQLID,
		},
	},
});
