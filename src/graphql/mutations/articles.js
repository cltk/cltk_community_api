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

	articleRemove: {
		type: RemoveType,
		description: 'Remove article',
		args: {
			articleId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve (_, { articleId }, { token }) {
			const articleService = new ArticleService(token);
			return await articleService.remove(articleId);
		}
	}
};

export default articleMutationFields;
