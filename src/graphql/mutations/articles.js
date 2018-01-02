import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import ArticleType, { ArticleInputType } from '../types/article';
import RemoveType from '../types/remove';

// Logic
import ArticleService from '../logic/articles';


const articleMutationFields = {
	articleCreate: {
		type: ArticleType,
		description: 'Create a new article',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			article: {
				type: new GraphQLNonNull(ArticleInputType)
			},
		},
		async resolve(_, { hostname, article }, { token }) {
			const articleService = new ArticleService(token);
			return await articleService.create(hostname, article);
		}
	},
	articleUpdate: {
		type: ArticleType,
		description: 'Update article',
		args: {
			article: {
				type: new GraphQLNonNull(ArticleInputType),
			},
		},
		async resolve(_, { article }, { token }) {
			const articleService = new ArticleService(token);
			return await articleService.update(article);
		}
	},

	articleSave: {
		type: ArticleType,
		description: 'Save an article as a user is editing',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			article: {
				type: new GraphQLNonNull(ArticleInputType)
			},
		},
		async resolve(_, { hostname, article }, { token }) {
			const articleService = new ArticleService(token);
			return await articleService.save(hostname, article);
		}
	},

	articleRemove: {
		type: RemoveType,
		description: 'Remove article',
		args: {
			_id: {
				type: new GraphQLNonNull(GraphQLString),
			},
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		async resolve (_, { _id, hostname }, { token }) {
			const articleService = new ArticleService(token);
			return await articleService.remove(_id, hostname);
		}
	}
};

export default articleMutationFields;
