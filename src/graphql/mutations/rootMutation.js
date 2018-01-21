import { GraphQLObjectType } from 'graphql';

import projectMutationFields from './projects';
import itemMutationFields from './items';
import userMutationFields from './users';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...projectMutationFields,
		...itemMutationFields,
		...userMutationFields,
	},
});

export default RootMutations;
