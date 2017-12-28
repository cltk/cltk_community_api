import mongoose from 'mongoose';
import shortid from 'shortid';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

// models
import Project from './project';

const Schema = mongoose.Schema;

/**
 * Article base schema
 * @type {Schema}
 */
const ArticleSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	title: {
		type: String,
		required: true,
		trim: true,
		index: true
	},
	content: {
		type: String,
	},
	projectId: {
		type: String,
		ref: 'Project',
		index: true,
		required: true,
	},
});


// add timestamps (createdAt, updatedAt)
ArticleSchema.plugin(timestamp);

// add slug (slug)
ArticleSchema.plugin(URLSlugs('title', {
	indexUnique: false
}));

/**
 * Article mongoose model
 * @type {Object}
 */
const Article = mongoose.model('Article', ArticleSchema);

export default Article;
export { ArticleSchema };
