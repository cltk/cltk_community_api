import { GraphQLObjectType } from 'graphql';

// types
import projectType from '../types/project';
import { pubsub } from '../../graphql';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootSubscription = new GraphQLObjectType({
	name: 'RootSubscriptionType',
	description: 'Root Subscription object type',
	fields: {
		projectNew: {
			type: projectType,
			description: 'Informs about new project',
			subscribe: () => pubsub.asyncIterator('projectNew'),
		}
	},
});

export default RootSubscription;
