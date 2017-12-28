import mongoose from 'mongoose';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

/**
 * Comment base schema
 * @type {Schema}
 */
const CommentSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	itemId: {
		type: String,
		required: true,
	},
	content: {
		type: String,
	},
});


// add timestamps (createdAt, updatedAt)
CommentSchema.plugin(timestamp);

/**
 * Comment mongoose model
 * @type {Object}
 */
const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
export { CommentSchema };
