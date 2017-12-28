import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Comment from '../../models/comment';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError, ArgumentError } from '../errors';


/**
 * Logic-layer service for dealing with comments
 */

export default class CommentService extends PermissionsService {
	/**
	 * Count comments
	 * @returns {number} count of comments
	 */
	async count() {
		return await Comment.count();
	}

	/**
	 * Get a list of comments
	 * @param {string} projectId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of comments
	 */
	async getComments({ projectId, textsearch, offset, limit }) {
		const args = { projectId };

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Comment.find(args)
			.sort({ slug: 1})
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get comment
	 * @param {string} projectId - id of the parent project for the comment
	 * @param {number} _id - id of comment
	 * @param {string} slug - slug of comment
	 * @returns {Object[]} array of comments
	 */
	async getComment({ projectId, _id, slug, }) {
		const where = { projectId };

		if (!_id && !slug) {
			return null;
		}

		if (_id) {
			where._id = _id;
		}

		if (slug) {
			where.slug = slug;
		}

		return await Comment.findOne(where);
	}

	/**
	 * Create a new comment
	 * @param {string} hostname - hostname of the comment for the project
	 * @param {Object} comment - comment candidate
	 * @returns {Object} created comment
	 */
	async create(hostname, comment) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		const commentProject = await Project.findOne({ hostname });

		// Initiate project
		if (!commentProject) throw new ArgumentError({ data: { field: 'project._id' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(commentProject);
		if (!userIsAdmin) throw new PermissionError();

		// set comment projectid and slug
		comment.projectId = commentProject._id;
		comment.slug = _s.slugify(comment.title);

		// Initiate new comment
		const newComment = new Comment(comment);

		// save new comment and return result
		return await newComment.save();
	}

	/**
	 * Update a comment
	 * @param {Object} comment - comment candidate
	 * @returns {Object} updated comment
	 */
	async update(comment) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findOne({ _id: comment.projectId });
		if (!project) throw new ArgumentError({ data: { field: 'comment.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Comment.update({ _id: comment._id }, { $set: comment });

		// TODO
		// error handling

		// return updated comment
		return await Comment.findById(comment._id);
	}

	/**
	 * Remove a comment
	 * @param {string} _id - id of comment to Remove
	 * @returns {boolean} remove result
	 */
	async remove(_id) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findById(comment.projectId);
		if (!project) throw new ArgumentError({ data: { field: 'comment.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Comment.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}

}
