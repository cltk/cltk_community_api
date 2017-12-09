import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import CollectionType, { CollectionInputType } from '../types/collection';
import RemoveType from '../types/remove';

// models
import Collection from '../../models/collection';
import Project from '../../models/project';


const collectionMutationFields = {
	collectionCreate: {
		type: CollectionType,
		description: 'Create a new collection',
		args: {
			collection: {
				type: new GraphQLNonNull(CollectionInputType)
			}
		},
		async resolve(parent, { collection }, context) {
			const CollectionProject = await Project.findByHostname(context.project.hostname);
			collection.projectId = CollectionProject._id;
			// Initiate new collection
			const NewCollection = new Collection(collection);

			return NewCollection.save();
		}
	},
	collectionUpdate: {
		type: CollectionType,
		description: 'Update collection',
		args: {
			collection: {
				type: new GraphQLNonNull(CollectionInputType),
			},
			collectionId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve(parent, { collection, collectionId }, context) {
			// Initiate collection
			const FoundCollection = await Collection.findById(collectionId);
			if (!FoundCollection) throw new ArgumentError({ data: { field: 'collectionId' } });

			// Perform action
			// update collection
			Object.keys(collection).forEach((key) => {
				FoundCollection[key] = item[key];
			});

			// Save new collection
			try {
				return await FoundCollection.save();
			} catch (err) {
				handleMongooseError(err);
			}
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
		async resolve (parent, { collectionId }, { user, collection }) {
			// if user is not logged in
			if (!user) throw new AuthenticationError();

			// initiate collection
			const FoundCollection = await Collection.findById(collectionId);
			if (!FoundCollection) throw new ArgumentError({ data: { field: 'collectionId' } });

			// perform action
			// save new collection
			try {
				await FoundCollection.remove();
				return {
					_id: collectionId,
				};
			} catch (err) {
				handleMongooseError(err);
			}
		}
	}
};

export default collectionMutationFields;
