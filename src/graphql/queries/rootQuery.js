import { GraphQLObjectType } from 'graphql';

import userProfileQueryFields from './userProfile';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Root query object type',
	fields: {
		...userProfileQueryFields
	},
});

export default RootQuery;
