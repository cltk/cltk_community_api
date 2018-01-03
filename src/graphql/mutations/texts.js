import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';

// types
import TextType, { TextInputType } from '../types/text';
import RemoveType from '../types/remove';

// Logic
import TextService from '../logic/texts';


const textMutationFields = {
	textCreate: {
		type: TextType,
		description: 'Create a new text',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			text: {
				type: new GraphQLNonNull(TextInputType)
			},
		},
		async resolve(_, { hostname, text }, { token }) {
			const textService = new TextService(token);
			return await textService.create(hostname, text);
		}
	},
	textUpdate: {
		type: TextType,
		description: 'Update text',
		args: {
			text: {
				type: new GraphQLNonNull(TextInputType),
			},
		},
		async resolve(_, { text }, { token }) {
			const textService = new TextService(token);
			return await textService.update(text);
		}
	},

	textRemove: {
		type: RemoveType,
		description: 'Remove text',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLString),
			},
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		async resolve (_, { _id, hostname }, { token }) {
			const textService = new TextService(token);
			return await textService.remove(_id, hostname);
		}
	}
};

export default textMutationFields;
