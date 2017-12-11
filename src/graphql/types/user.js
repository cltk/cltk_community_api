import createType from 'mongoose-schema-to-graphql';

// models
import User from '../../models/user';


const config = {
	name: 'UserType',
	description: 'User base schema',
	class: 'GraphQLObjectType',
	schema: User.schema,
	exclude: ['password', 'hash', 'salt', 'resetPasswordToken', 'verified', 'resetPasswordExpires', 'oauthIds', 'twitter', 'facebook'],
	extend: {}
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
