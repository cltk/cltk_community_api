import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { formatError } from 'apollo-errors';
import { GraphQLSchema, execute, subscribe } from 'graphql';
import {
	makeRemoteExecutableSchema, mergeSchemas, introspectSchema
} from 'graphql-tools';
import { createApolloFetch } from 'apollo-fetch';
import { maskErrors } from 'graphql-errors';
import { createServer } from 'http';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import jwt from 'jsonwebtoken';


// authentication
import { jwtAuthenticate } from './authentication';

// graphql
import RootQuery from './graphql/queries/rootQuery';
import RootMutation from './graphql/mutations/rootMutation';

// models
import User from './models/user';

/**
 * Create a remote schema for merging with local schema definition
 * via example Schema stitching from the repo mentioned here:
 * https://dev-blog.apollodata.com/graphql-schema-stitching-8af23354ac37
 */
const createRemoteSchema = async (uri) => {
	const fetcher = createApolloFetch({uri});
	return makeRemoteExecutableSchema({
		schema: await introspectSchema(fetcher),
		fetcher
	});
};

/**
 * Root schema
 * @type {GraphQLSchema}
 */
const RootSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});

// mask error messages
maskErrors(RootSchema);

export const pubsub = new RedisPubSub({
	connection: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
});

const getGraphQLContext = (req) => {
	let token;

	if ('authorization' in req.headers) {
		token = req.headers.authorization.replace('JWT ', '');
	}

	return ({
		token,
		hostname: req.hostname,
	});
};

/**
 * Set up the graphQL HTTP endpoint
 * @param  {Object} app 	express app instance
 */
const setupGraphql = async (app) => {
	const chsTextserverSchema = await createRemoteSchema(process.env.TEXTSERVER_URL || 'http://textserver.chs.harvard.edu/graphql');

	const schema = mergeSchemas({
		schemas: [RootSchema, chsTextserverSchema],
	});


	app.use('/graphql', jwtAuthenticate, graphqlExpress(req => ({
		schema,
		context: getGraphQLContext(req),
		formatError,
	})));

	app.use('/graphiql', graphiqlExpress({
		endpointURL: '/graphql',
	}));
};

export default setupGraphql;
