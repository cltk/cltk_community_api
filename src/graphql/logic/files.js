import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import File from '../../models/file';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


/**
 * Logic-layer service for dealing with files
 */

export default class FileService extends PermissionsService {
	/**
	 * Count files
	 * @param {string} itemId
	 * @param {string} projectId
	 * @returns {number} count of files
	 */
	async count({ itemId, projectId }) {
		const args = {};

		if (!itemId && !projectId) {
			return 0;
		}

		if (projectId) {
			args.projectId = projectId;
		}

		if (itemId) {
			args.itemId = itemId;
		}

		return await File.count(args);
	}

	/**
	 * Get a list of files
	 * @param {string} projectId
	 * @param {string} itemId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of files
	 */
	async getFiles({ projectId, itemId, textsearch, offset, limit }) {
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

		return await File.find(args)
			.sort({ createdAt: 1 })
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get file
	 * @param {string} itemId - id of item of file
	 * @param {number} _id - id of file
	 * @param {string} slug - slug of file
	 * @returns {Object[]} array of files
	 */
	async getFile({ itemId, _id, slug }) {
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

		return await File.findOne(where);
	}

	/**
	 * Create a new file
	 * @param {Object} file - file candidate
	 * @param {string} hostname - hostname of file project
	 * @returns {Object} created file
	 */
	async create(hostname, file) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// Initiate new file
		file.projectId = project._id;
		file.slug = _s.slugify(file.title);
		const newFile = new File(file);

		// save new file
		return await newFile.save();
	}

	/**
	 * Update a file
	 * @param {Object} file - file candidate
	 * @returns {Object} updated file
	 */
	async update(file) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne(file.projectId);
		if (!project) throw new ArgumentError({ data: { field: 'file.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await File.update({ _id: file._id }, { $set: file });

		// TODO
		// error handling

		// return updated file
		return await File.findById(file._id);
	}

	/**
	 * Remove a file
	 * @param {string} _id - id of file to Remove
	 * @returns {boolean} remove result
	 */
	async remove(_id) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne(hostname);
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await File.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}
}
