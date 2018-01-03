import mongoose from 'mongoose';
import shortid from 'shortid';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

const Schema = mongoose.Schema;

/**
 * Text base schema
 * @type {Schema}
 */
const TextSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	projectId: {
		type: String,
		required: true,
		trim: true,
	},
	ctsNamespace: {
		type: String,
		required: true,
		trim: true,
	},
	textgroup: {
		type: String,
		required: true,
		trim: true,
	},
	work: {
		type: String,
		required: true,
		trim: true,
	},
});


// add timestamps (createdAt, updatedAt)
TextSchema.plugin(timestamp);

// Statics
TextSchema.statics.getByItemId = function getByItemId(itemId, cb) {
	return this.findOne({ itemId }, cb);
};

/**
 * Text mongoose model
 * @type {Object}
 */
const Text = mongoose.model('Text', TextSchema);

export default Text;
export { TextSchema };
