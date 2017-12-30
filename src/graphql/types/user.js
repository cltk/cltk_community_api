import {
	GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString, GraphQLBoolean, 
} from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// Logic
import UserService from '../logic/users';

// Model
import User from '../../models/user';


const config = {
	name: 'UserType',
	description: 'User base schema',
	class: 'GraphQLObjectType',
	schema: User.schema,
	exclude: ['password', 'hash', 'salt', 'resetPasswordToken', 'verified', 'resetPasswordExpires', 'oauthIds', 'twitter', 'facebook'],
	extend: {
		isActiveUser: {
			type: GraphQLBoolean,
			description: 'Check if user id is for active user',
			args: {
				_id: {
					type: GraphQLString,
				},
			},
			resolve(parent, { _id }, { token }) {
				const userService = new UserService(token);
				return userService.userIsActiveUser(_id);
			},
		},
	},
};

const configInput = {
	name: 'UserInputType',
	description: 'User Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: User.schema,
	exclude: [],
};

const UserType = createType(config);
const UserInputType = createType(configInput);

export default UserType;
export { UserInputType };
