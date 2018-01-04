import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Text from '../../models/text';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


/**
 * Logic-layer service for dealing with texts
 */

export default class TextService extends PermissionsService {
	/**
	 * Count texts
	 * @param {string} projectId
	 * @returns {number} count of texts
	 */
	async count({ projectId }) {
		const args = {};

		if (!projectId) {
			return 0;
		}

		if (projectId) {
			args.projectId = projectId;
		}

		return await Text.count(args);
	}

	/**
	 * Get a list of texts
	 * @param {string} projectId
	 * @param {string} itemId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of texts
	 */
	async getTexts({ projectId, itemId, textsearch, offset, limit }) {
		const args = {};

		if (!projectId && !itemId) {
			return [];
		}

		if (projectId) {
			args.projectId = projectId;
		}

		if (itemId) {
			args.itemId = itemId;
		}

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Text.find(args)
			.sort({ createdAt: 1 })
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get text
	 * @param {string} projectId - id of item of text
	 * @param {number} _id - id of text
	 * @param {string} slug - slug of text
	 * @returns {Object[]} array of texts
	 */
	async getText({ projectId, _id, slug }) {
		const where = {};

		if (!_id && !slug) {
			return null;
		}

		if (_id) {
			where._id = _id;
		}

		if (slug) {
			where.slug = slug;
		}

		return await Text.findOne(where);
	}

	/**
	 * Create a new text
	 * @param {Object} text - text candidate
	 * @param {string} hostname - hostname of text project
	 * @returns {Object} created text
	 */
	async create(hostname, text) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// Initiate new text
		text.projectId = project._id;
		text.slug = _s.slugify(text.title);
		const newText = new Text(text);

		// save new text
		return await newText.save();
	}

	/**
	 * Update a text
	 * @param {Object} text - text candidate
	 * @returns {Object} updated text
	 */
	async update(text) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne(text.projectId);
		if (!project) throw new ArgumentError({ data: { field: 'text.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Text.update({ _id: text._id }, { $set: text });

		// TODO
		// error handling

		// return updated text
		return await Text.findById(text._id);
	}

	/**
	 * Remove a text
	 * @param {string} _id - id of text to Remove
	 * @returns {boolean} remove result
	 */
	async remove(_id, hostname) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Text.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}
}
