import mongoose from 'mongoose';

// plug-ins
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

// models
import Project from './project';

const Schema = mongoose.Schema;

/**
 * Collection base schema
 * @type {Schema}
 */
const CollectionSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		index: true
	},
	description: {
		type: String,
	},
	projectId: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		index: true,
		required: true,
	},
});


// add timestamps (createdAt, updatedAt)
CollectionSchema.plugin(timestamp);

// add slug (slug)
CollectionSchema.plugin(URLSlugs('title'));

/**
 * Statics
 */

/**
 * Find all collections belonging to a project (by project id)
 * @param  {String}   projectId 	Project id
 * @return {Promise}             	(Promise) Array of found collections
 */
CollectionSchema.statics.findByProjectId = function findByProjectId(projectId) {
	return this.find({ projectId });
};

/**
 * Check if a user is an owner of a collection by id
 * @param  {String}  collectionId Collection id
 * @param  {String}  userId       User id
 * @return {Promise}              (Promise) True if user is owner of the collection
 */
CollectionSchema.statics.isUserAdmin = async function isUserAdmin(collectionId, userId) {

	try {

		// get collection by id
		const collection = await this.findById(collectionId);

		if (collection) return Project.isUserAdmin(collection.projectId, userId);
		throw new Error('Incorrect collection id');

	} catch (err) {
		throw err;
	}
};


/**
 * Collection mongoose model
 * @type {Object}
 */
const Collection = mongoose.model('Collection', CollectionSchema);

export default Collection;
export { CollectionSchema };
