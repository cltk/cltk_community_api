import { GraphQLNonNull, GraphQLID } from 'graphql';

// types
import ItemType, { ItemInputType } from '../types/item';
import RemoveType from '../types/remove';

// models
import Item from '../../models/item';
import Collection from '../../models/collection';

// errors
import {
	AuthenticationError,
	PermissionError,
	ProjectError,
	ArgumentError,
	// MongooseGeneralError,
	// MongooseDuplicateKeyError,
	// MongooseValidationError,
	handleMongooseError,
} from '../errors';


const itemMutationFields = {
	itemCreate: {
		type: ItemType,
		description: 'Create new item',
		args: {
			item: {
				type: new GraphQLNonNull(ItemInputType),
			},
		},
		async resolve(obj, { item }, { user, project }) {
			/**
			 * Initiate item
			 */
			const NewItem = new Item(item);

			// save new item
			try {
				return await NewItem.save();
			} catch (err) {
				handleMongooseError(err);
			}
		},
	},

	itemUpdate: {
		type: ItemType,
		description: 'Update item',
		args: {
			item: {
				type: new GraphQLNonNull(ItemInputType),
			},
			itemId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve(parent, { item, itemId }, { user, project }) {

			/**
			 * Validate connection
			 */

			// if operation doesn't come from admin page
			if (!project.adminPage) throw new ProjectError();

			// if user is not logged in
			if (!user) throw new AuthenticationError();


			/**
			 * Initiate item
			 */
			const FoundItem = await Item.findById(itemId);
			if (!FoundItem) throw new ArgumentError({ data: { field: 'itemId' } });


			/**
			 * Validate permissions
			 */
			try {
				const userIsAdmin = await FoundItem.validateUser(user._id);
				if (!userIsAdmin) throw new PermissionError();
			} catch (err) {
				throw new PermissionError();
			}



			/**
			 * Perform action
			 */

			// update item
			Object.keys(item).forEach((key) => {
				FoundItem[key] = item[key];
			});

			// Save new item
			try {
				return await FoundItem.save();
			} catch (err) {
				handleMongooseError(err);
			}
		}
	},

	itemRemove: {
		type: RemoveType,
		description: 'Remove item',
		args: {
			itemId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve(parent, { itemId }, { user, project }) {

			/**
			 * Validate connection
			 */

			// if operation doesn't come from admin page
			if (!project.adminPage) throw new ProjectError();

			// if user is not logged in
			if (!user) throw new AuthenticationError();


			/**
			 * Initiate item
			 */
			const FoundItem = await Item.findById(itemId);
			if (!FoundItem) throw new ArgumentError({ data: { field: 'itemId' } });


			/**
			 * Validate permissions
			 */
			try {
				const userIsAdmin = await FoundItem.validateUser(user._id);
				if (!userIsAdmin) throw new PermissionError();
			} catch (err) {
				throw new PermissionError();
			}


			/**
			 * Perform action
			 */

			// Save new item
			try {
				await FoundItem.remove();
				return {
					_id: itemId,
				};
			} catch (err) {
				handleMongooseError(err);
			}
		}
	},
};

export default itemMutationFields;
