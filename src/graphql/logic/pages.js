import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Page from '../../models/page';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError, ArgumentError } from '../errors';


/**
 * Logic-layer service for dealing with pages
 */

export default class PageService extends PermissionsService {
	/**
	 * Count pages
	 * @returns {number} count of pages
	 */
	async count({ projectId }) {
		return await Page.count({ projectId });
	}

	/**
	 * Get a list of pages
	 * @param {string} projectId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of pages
	 */
	async getPages({ projectId, textsearch, offset, limit }) {
		const args = { projectId };

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Page.find(args)
			.sort({ slug: 1})
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get page
	 * @param {string} projectId - id of the parent project for the page
	 * @param {number} _id - id of page
	 * @param {string} slug - slug of page
	 * @returns {Object[]} array of pages
	 */
	async getPage({ projectId, _id, slug, }) {
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

		return await Page.findOne(where);
	}

	/**
	 * Create a new page
	 * @param {string} hostname - hostname of the page for the project
	 * @param {Object} page - page candidate
	 * @returns {Object} created page
	 */
	async create(hostname, page) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		const pageProject = await Project.findOne({ hostname });

		// Initiate project
		if (!pageProject) throw new ArgumentError({ data: { field: 'project._id' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(pageProject);
		if (!userIsAdmin) throw new PermissionError();

		// set page projectid and slug
		page.projectId = pageProject._id;
		page.slug = _s.slugify(page.title);

		// Initiate new page
		const newPage = new Page(page);

		// save new page and return result
		return await newPage.save();
	}

	/**
	 * Update a page
	 * @param {Object} page - page candidate
	 * @returns {Object} updated page
	 */
	async update(page) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findOne({ _id: page.projectId });
		if (!project) throw new ArgumentError({ data: { field: 'page.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Page.update({ _id: page._id }, { $set: page });

		// TODO
		// error handling

		// return updated page
		return await Page.findById(page._id);
	}

	/**
	 * Remove a page
	 * @param {string} _id - id of page to Remove
	 * @returns {boolean} remove result
	 */
	async remove(_id) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findById(page.projectId);
		if (!project) throw new ArgumentError({ data: { field: 'page.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Page.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}

}
