import { GraphQLObjectType } from 'graphql';

import articleMutationFields from './articles';
import projectMutationFields from './projects';
import collectionMutationFields from './collections';
import itemMutationFields from './items';
import miradorMutationFields from './miradorManifests';
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
		...articleMutationFields,
		...collectionMutationFields,
		...itemMutationFields,
		...miradorMutationFields,
		...userMutationFields,
	},
});

export default RootMutations;
