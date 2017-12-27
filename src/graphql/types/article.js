import { GraphQLList, GraphQLInt, GraphQLString, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Article from '../../models/article';

// logic
import ArticleService from '../logic/articles';
import ItemService from '../logic/items';

// types
import ItemType, { ItemInputType } from './item';


const config = {
	name: 'ArticleType',
	description: 'Article base query type',
	class: 'GraphQLObjectType',
	schema: Article.schema,
	exclude: [],
};

const configInput = {
	name: 'ArticleInputType',
	description: 'Article Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Article.schema,
	exclude: [],
};

const ArticleType = createType(config);
const ArticleInputType = createType(configInput);

export default ArticleType;
export { ArticleInputType };
