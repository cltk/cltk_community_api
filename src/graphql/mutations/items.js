import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

// types
import ItemType, { ItemInputType } from '../types/item';
import RemoveType from '../types/remove';

// Logic
import ItemService from '../logic/items';



const itemMutationFields = {
	itemCreate: {
		type: ItemType,
		description: 'Create new item',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			item: {
				type: new GraphQLNonNull(ItemInputType),
			},
		},
		async resolve(obj, { hostname, item }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.create(hostname, item);
		},
	},

	itemUpdate: {
		type: ItemType,
		description: 'Update item',
		args: {
			item: {
				type: new GraphQLNonNull(ItemInputType),
			},
		},
		async resolve(parent, { item }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.update(item);
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
		async resolve(parent, { itemId }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.remove(itemId);
		}
	},
};

export default itemMutationFields;
