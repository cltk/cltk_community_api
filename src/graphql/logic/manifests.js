import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Manifest from '../../models/manifest';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


/**
 * Logic-layer service for dealing with manifests
 */

export default class ManifestService extends PermissionsService {
	/**
	 * Count manifests
	 * @param {string} itemId
	 * @param {string} projectId
	 * @returns {number} count of manifests
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

		return await Manifest.count(args);
	}

	/**
	 * Get a list of manifests
	 * @param {string} projectId
	 * @param {string} itemId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of manifests
	 */
	async getManifests({ projectId, itemId, textsearch, offset, limit }) {
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

		return await Manifest.find(args)
			.sort({ createdAt: 1 })
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get manifest
	 * @param {string} itemId - id of item of manifest
	 * @param {number} _id - id of manifest
	 * @param {string} slug - slug of manifest
	 * @returns {Object[]} array of manifests
	 */
	async getManifest({ itemId, _id, slug }) {
		const where = {};

		if (!itemId && !_id && !slug) {
			return null;
		}

		if (itemId) {
			where.itemId = itemId;
		}

		if (_id) {
			where._id = _id;
		}

		if (slug) {
			where.slug = slug;
		}

		return await Manifest.findOne(where);
	}

	/**
	 * Create a new manifest
	 * @param {Object} manifest - manifest candidate
	 * @param {string} hostname - hostname of manifest project
	 * @returns {Object} created manifest
	 */
	async create(hostname, manifest) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// Initiate new manifest
		manifest.projectId = project._id;
		manifest.slug = _s.slugify(manifest.title);
		const newManifest = new Manifest(manifest);

		// save new manifest
		return await newManifest.save();
	}

	/**
	 * Update a manifest
	 * @param {Object} manifest - manifest candidate
	 * @returns {Object} updated manifest
	 */
	async update(manifest) {
		// if user is not logged in
		// if (!this.userId) throw new AuthenticationError();

		// find project
		// const project = await Project.findOne(manifest.projectId);
		// if (!project) throw new ArgumentError({ data: { field: 'manifest.projectId' } });

		// validate permissions
		// const userIsAdmin = this.userIsProjectAdmin(project);
		// if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Manifest.update({ _id: manifest._id }, { $set: manifest });

		// TODO
		// error handling

		// return updated manifest
		return await Manifest.findById(manifest._id);
	}

	/**
	 * Remove a manifest
	 * @param {string} _id - id of manifest to Remove
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
		const result = await Manifest.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}
}
