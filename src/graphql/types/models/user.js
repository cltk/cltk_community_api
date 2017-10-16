import createType from 'mongoose-schema-to-graphql';

// models
import User from '../../../models/user';


const config = {
	name: 'UserType',
	description: 'User base schema',
	class: 'GraphQLObjectType',
	schema: User.schema,
	exclude: ['password', 'hash', 'salt'],
	extend: {}
};

const UserType = createType(config);

export default UserType;

// IMPORTANT: no possibility of inputing a user (creating / registering new user) through graphql
// that is why, there in no input type for user
