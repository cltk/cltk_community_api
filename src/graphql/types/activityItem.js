import { GraphQLString, GraphQLInt, GraphQLObjectType } from 'graphql';


import UserType from './user';

/**
 * Activity Item type
 * @type {GraphQLObjectType}
 */

const ActivityItemType = new GraphQLObjectType({
	name: 'ActivityItemType',
	description: 'An activity item in a project activity feed',
	fields: () => ({
		user: {
			type: UserType,
		},
		type: {
			type: GraphQLString,
		},
		excerpt: {
			type: GraphQLString,
		},
		url: {
			type: GraphQLString,
		},
	}),
});

export default ActivityItemType;
