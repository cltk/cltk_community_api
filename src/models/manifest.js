import mongoose from 'mongoose';
import shortid from 'shortid';
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';
import ImageSchema from './image';

const Schema = mongoose.Schema;

const ManifestSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	label: {
		type: String,
	},
	abbr: {
		type: String,
	},
	author: {
		type: String,
	},
	seeAlso: {
		type: String,
	},
	attribution: {
		type: String,
	},
	remoteUri: {
		type: String,
	},
	images: [ImageSchema],
	itemId: {
		type: String,
		ref: 'Item',
		index: true
	},
});


// add timestamp (createdAt, updatedAt)
ManifestSchema.plugin(timestamp);

// add slug (slug)
ManifestSchema.plugin(URLSlugs('title', {
	indexUnique: false,
}));

const Manifest = mongoose.model('manifest', ManifestSchema);

export default Manifest;
export { ManifestSchema };
