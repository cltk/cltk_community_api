import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';


const Schema = mongoose.Schema;

/**
 * Base Project mongoose schema
 * @type {Schema}
 */
const ProjectSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		index: true,
	},
	hostname: {
		unique: true,
		required: true,
		type: String,
		trim: true,
		index: true,
	},
	description: {
		type: String,
	},
	users: [{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		role: {
			type: String,
			enum: ['admin', 'editor'],
		},
	}],
});


// add timestamps (createdAt, updatedAt)
ProjectSchema.plugin(timestamp);

// add slug (slug)
ProjectSchema.plugin(URLSlugs('title'));


/**
 * Statics
 */

/**
 * Find project by user id
 * @param  {String} userId User id
 * @return {Promise} (Promise) Array of projects
 */
ProjectSchema.statics.findByUserId = function findByUserId(userId) {
	return this.find({ users: { $elemMatch: { userId } } });
};

/**
 * Find project by hostname of request
 * @param  {String} hostname The hostname that generated the request, such as myproject.orphe.us
 * @return {Promise} (Promise) The Project
 */
ProjectSchema.statics.findByHostname = (hostname, cb) => (
	Project.findOne({ hostname }, cb)
);

/**
 * Check if user is an owner of a project by project id
 * @param  {String}   projectId 	Project id
 * @param  {String}   userId    	User id
 * @return {Promise}            	(Promise) True if user has the role of owner for this project
 */
ProjectSchema.statics.isUserAdmin = async function isUserAdmin(projectId, userId) {
	try {
		const project = await this.find({ _id: projectId, users: { $elemMatch: { userId, role: 'admin' } } });

		if (project) return true;

		return false;

	} catch (err) {
		throw err;
	}
};

/**
 * Create a new project by user
 * @param  {String}   userId    	User id
 * @param  {Object}   newProject 	Object with new project values
 * @return {Promise}               	(Promise) The new Project
 */
ProjectSchema.statics.createByAdmin = function createByAdmin(userId, newProject) {
	return this.create({
		users: [{
			userId,
			role: 'admin',
		}],
		...newProject,
	});
};


/**
 * Project mongoose model
 * @type {Object}
 */
const Project = mongoose.model('Project', ProjectSchema);

export default Project;
export { ProjectSchema };
