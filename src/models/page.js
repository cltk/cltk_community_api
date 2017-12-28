import mongoose from 'mongoose';
import shortid from 'shortid';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

// models
import Project from './project';

const Schema = mongoose.Schema;

/**
 * Page base schema
 * @type {Schema}
 */
const PageSchema = new Schema({
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
		type: Schema.Types.Mixed,
	},
	coverImage: {
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
PageSchema.plugin(timestamp);

// add slug (slug)
PageSchema.plugin(URLSlugs('title', {
	indexUnique: false
}));

/**
 * Page mongoose model
 * @type {Object}
 */
const Page = mongoose.model('Page', PageSchema);

export default Page;
export { PageSchema };
