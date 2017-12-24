import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

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
		},
		async resolve(_, { hostname, collection }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.create(hostname, collection);
		}
	},
	collectionUpdate: {
		type: CollectionType,
		description: 'Update collection',
		args: {
			collection: {
				type: new GraphQLNonNull(CollectionInputType),
			},
		},
		async resolve(_, { collection }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.update(collection);
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
