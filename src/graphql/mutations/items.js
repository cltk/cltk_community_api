import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';

// types
import ItemType, { ItemInputType } from '../types/item';
import { FileInputType } from '../types/file';
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
			files: {
				type: new GraphQLList(FileInputType),
			},
		},
		async resolve(obj, { hostname, item, files }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.create(hostname, item, files);
		},
	},

	itemUpdate: {
		type: ItemType,
		description: 'Update item',
		args: {
			item: {
				type: new GraphQLNonNull(ItemInputType),
			},
			files: {
				type: new GraphQLList(FileInputType),
			},
		},
		async resolve(parent, { item, files }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.update(item, files);
		}
	},

	itemRemove: {
		type: RemoveType,
		description: 'Remove item',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLString),
			},
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		async resolve(parent, { _id, hostname }, { token }) {
			const itemService = new ItemService(token);
			return await itemService.remove(_id, hostname);
		}
	},
};

export default itemMutationFields;
