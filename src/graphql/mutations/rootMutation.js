import { GraphQLObjectType } from 'graphql';

import exampleMutation from './exampleMutation';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
    ...exampleMutation
	},
});

export default RootMutations;
