import mongoose from 'mongoose';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';
import mongoosePaginate from 'mongoose-paginate';

// models
import Collection from './collection';

const Schema = mongoose.Schema;

export const MetadataSchema = new Schema({
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
	title: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		index: true
	},
	collectionId: {
		type: Schema.Types.ObjectId,
		ref: 'Collection',
		// required: true,
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
ItemSchema.plugin(URLSlugs('title'));



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

// ItemSchema.statics.createByUser = async function createByUser(newItem, userId) {

// 	try {
// 		const userIsAdmin = await Collection.isUserAdmin(item.collectionId, user._id);
// 		if (!userIsAdmin) throw new PermissionError();
// 	} catch (err) {
// 		console.error(err);
// 		throw new MongooseGeneralError();
// 	}

// };

/**
 * Item mongoose model
 * @type {Object}
 */
const Item = mongoose.model('Item', ItemSchema);

export default Item;
export { ItemSchema };
