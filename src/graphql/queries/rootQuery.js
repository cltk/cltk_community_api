import { GraphQLObjectType } from 'graphql';

import projectQueryFields from './projects';
import userQueryFields from './users';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Root query object type',
	fields: {
		...projectQueryFields,
		...userQueryFields,
	},
});

export default RootQuery;
