import { GraphQLList, GraphQLInt, GraphQLString, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Comment from '../../models/comment';

// logic
import CommentService from '../logic/comments';
import ItemService from '../logic/items';

// types
import ItemType, { ItemInputType } from './item';


const config = {
	name: 'CommentType',
	description: 'Comment base query type',
	class: 'GraphQLObjectType',
	schema: Comment.schema,
	exclude: [],
};

const configInput = {
	name: 'CommentInputType',
	description: 'Comment Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Comment.schema,
	exclude: [],
};

const CommentType = createType(config);
const CommentInputType = createType(configInput);

export default CommentType;
export { CommentInputType };
