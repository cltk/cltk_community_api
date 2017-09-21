import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';

// types
import { RemoveType } from '../types';
import { ExampleType, ExampleInputType } from '../types/models/example';

// bll
import ExampleService from '../logic/ExampleService';

const exampleMutationFields = {
	exampleCreate: {
		type: ExampleType,
		description: 'Example create mutation',
		args: {
			example:
			{
				type: new GraphQLNonNull(ExampleInputType)
			}
		},
		async resolve(obj, { example }, { user }) {
			const exampleService = new ExampleService(user);
			return await exampleService.exampleCreate(example);
		}
	},
	exampleUpdate: {
		type: ExampleType,
		description: 'Example update mutation',
		args: {
			_id: {
				type: GraphQLID,
			},
			example: {
				type: ExampleInputType
			}
		},
		async resolve(obj, { _id, example }, { user }) {
			const exampleService = new ExampleService(user);
			return await exampleService.exampleUpdate(_id, example);
		}
	}
};

export default exampleMutationFields;
