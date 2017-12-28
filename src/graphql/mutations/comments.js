import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import CommentType, { CommentInputType } from '../types/comment';
import RemoveType from '../types/remove';

// Logic
import CommentService from '../logic/comments';


const commentMutationFields = {
	commentCreate: {
		type: CommentType,
		description: 'Create a new comment',
		args: {
			hostname: {
				type: new GraphQLNonNull(GraphQLString)
			},
			comment: {
				type: new GraphQLNonNull(CommentInputType)
			},
		},
		async resolve(_, { hostname, comment }, { token }) {
			const commentService = new CommentService(token);
			return await commentService.create(hostname, comment);
		}
	},
	commentUpdate: {
		type: CommentType,
		description: 'Update comment',
		args: {
			comment: {
				type: new GraphQLNonNull(CommentInputType),
			},
		},
		async resolve(_, { comment }, { token }) {
			const commentService = new CommentService(token);
			return await commentService.update(comment);
		}
	},

	commentRemove: {
		type: RemoveType,
		description: 'Remove comment',
		args: {
			commentId: {
				type: new GraphQLNonNull(GraphQLID),
			}
		},
		async resolve (_, { commentId }, { token }) {
			const commentService = new CommentService(token);
			return await commentService.remove(commentId);
		}
	}
};

export default commentMutationFields;
