import { GraphQLList, GraphQLInt, GraphQLString, GraphQLID } from 'graphql';
import createType from 'mongoose-schema-to-graphql';

// models
import Page from '../../models/page';

// logic
import PageService from '../logic/pages';
import ItemService from '../logic/items';

// types
import ItemType, { ItemInputType } from './item';


const config = {
	name: 'PageType',
	description: 'Page base query type',
	class: 'GraphQLObjectType',
	schema: Page.schema,
	exclude: [],
};

const configInput = {
	name: 'PageInputType',
	description: 'Page Schema base create input type',
	class: 'GraphQLInputObjectType',
	schema: Page.schema,
	exclude: [],
};

const PageType = createType(config);
const PageInputType = createType(configInput);

export default PageType;
export { PageInputType };
