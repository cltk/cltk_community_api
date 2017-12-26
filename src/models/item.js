import mongoose from 'mongoose';
import shortid from 'shortid';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';
import mongoosePaginate from 'mongoose-paginate';

// models
import Collection from './collection';


const Schema = mongoose.Schema;


export const metadataTypes = ['text', 'number', 'date', 'place', 'media', 'item'];


export const MetadataSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	type: {
		type: String,
		enum: metadataTypes,
		required: true,
	},
	value: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	}
});

/**
 * Item base schema
 * @type {Schema}
 */
const ItemSchema = new Schema({
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
	projectId: {
		type: String,
		ref: 'Project',
		index: true
	},
	collectionId: {
		type: String,
		ref: 'Collection',
		index: true
	},
	description: {
		type: String,
	},
	metadata: [MetadataSchema],
	private: {
		type: Boolean,
		default: false,
	},
	files: {
		type: Array,
	}
});


// add timestamps (createdAt, updatedAt)
ItemSchema.plugin(timestamp);

// add slug (slug)
ItemSchema.plugin(URLSlugs('title', {
	indexUnique: false,
}));


/**
 * Statics
 */

/**
 * Find all items belonging to a collection
 * @param  {String} collectionId 	Collection id
 * @return {Promise}              	(Promise) Array of found items
 */

ItemSchema.statics.findByCollectionId = function findByCollectionId(collectionId) {
	return this.find({ collectionId }).select({ _id: 1 });
};


/**
 * Methods
 */

ItemSchema.methods.validateUser = function validateUser(userId) {
	return Collection.isUserAdmin(this.collectionId, userId);
};

/**
 * Item mongoose model
 * @type {Object}
 */
const Item = mongoose.model('Item', ItemSchema);

export default Item;
export { ItemSchema };
