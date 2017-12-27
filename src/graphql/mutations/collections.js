import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';

// types
import CollectionType, { CollectionInputType } from '../types/collection';
import RemoveType from '../types/remove';

// Logic
import CollectionService from '../logic/collections';


const collectionMutationFields = {
	collectionCreate: {
		type: CollectionType,
		description: 'Create a new collection',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			collection: {
				type: new GraphQLNonNull(CollectionInputType)
			},
			items: {
				type: new GraphQLList(GraphQLString),
			},
		},
		async resolve(_, { hostname, collection, items }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.create(hostname, collection, items);
		}
	},
	collectionUpdate: {
		type: CollectionType,
		description: 'Update collection',
		args: {
			collection: {
				type: new GraphQLNonNull(CollectionInputType),
			},
			items: {
				type: new GraphQLList(GraphQLString),
			},
		},
		async resolve(_, { collection, items }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.update(collection, items);
		}
	},

	collectionRemove: {
		type: RemoveType,
		description: 'Remove collection',
		args: {
			collectionId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve (_, { collectionId }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.remove(collectionId);
		}
	}
};

export default collectionMutationFields;
