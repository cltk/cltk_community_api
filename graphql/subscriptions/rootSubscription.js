import { GraphQLObjectType } from 'graphql';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootSubscription = new GraphQLObjectType({
	name: 'RootSubscriptionType',
	description: 'Root Subscription object type',
	fields: {
	},
});

export default RootSubscription;
