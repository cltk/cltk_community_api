import mongoose from 'mongoose';
import shortid from 'shortid';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

const Schema = mongoose.Schema;

/**
 * File base schema
 * @type {Schema}
 */
const FileSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: {
		type: String,
		required: true,
		trim: true,
		index: true
	},
	title: {
		type: String,
		required: true,
		trim: true,
		index: true
	},
	projectId: {
		type: String,
		ref: 'Project',
		index: true
	},
	itemId: {
		type: String,
		ref: 'Item',
		index: true
	},
	type: {
		type: String,
	},
	path: {
		type: String,
	},
	thumbPath: {
		type: String,
	},
});


// add timestamps (createdAt, updatedAt)
FileSchema.plugin(timestamp);

// add slug (slug)
FileSchema.plugin(URLSlugs('title', {
	indexUnique: false,
}));

// Statics
FileSchema.statics.getByItemId = function getByItemId(itemId, cb) {
	return this.findOne({ itemId }, cb);
};

/**
 * File mongoose model
 * @type {Object}
 */
const File = mongoose.model('File', FileSchema);

export default File;
export { FileSchema };
