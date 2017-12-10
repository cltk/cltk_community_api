import slugify from 'slugify';

// services
import PermissionsService from './PermissionsService';

// models
import Project from '../../models/project';

// errors
import { AuthenticationError } from '../errors';


/**
 * Logic-layer service for dealing with projects
 */

export default class ProjectService extends PermissionsService {
	/**
	 * Count projects
	 * @returns {number} count of projects
	 */
	async count() {
		return await Project.count();
	}

	/**
	 * Get a list of projects
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of projects
	 */
	async getProjects({ offset, limit }) {
		const args = {};

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Project.find(args)
			.sort({ slug: 1})
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get project
	 * @param {number} _id - id of project
	 * @param {string} slug - slug of project
	 * @param {string} hostname - hostname of project
	 * @returns {Object[]} array of projects
	 */
	async getProject({ _id, slug, hostname }) {
		const where = {};

		if (_id) {
			where._id = _id;
		}

		if (slug) {
			where.slug = slug;
		}

		if (hostname) {
			where.hostname = hostname;
		}

		return await Project.findOne(where);
	}

	/**
	 * Create a new project
	 * @param {Object} project - project candidate
	 * @returns {Object} created project
	 */
	async create(project) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// Initiate new project
		project.slug = slugify(project.title);
		const newProject = new Project(project);

		// Add user to project
		const projectUser = {
			userId: this.userId,
			role: 'admin',
		};
		newProject.users.push(projectUser);

		// save new project
		return await newProject.save();
	}

	/**
	 * Update a project
	 * @param {Object} project - project candidate
	 * @returns {Object} updated project
	 */
	async update(project) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// Initiate project
		const foundProject = await Project.findById(project._id);
		if (!foundProject) throw new ArgumentError({ data: { field: 'project._id' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(foundProject);
		if (!userIsAdmin) throw new PermissionsError();

		// perform action
		Project.update({ _id: project._id }, { $set: project });

		// TODO
		// error handling

		// return updated project
		return await Project.findById(project._id);
	}

	/**
	 * Remove a project
	 * @param {string} _id - id of project to Remove
	 * @returns {boolean} remove result
	 */
	async remove(_id) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// initiate project
		const foundProject = await Project.findById(projectId);
		if (!foundProject) throw new ArgumentError({ data: { field: 'projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(foundProject);
		if (!userIsAdmin) throw new PermissionsError();

		// perform action
		const result = await Project.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}

	/**
	 * Get project collections
	 * @param {string} projectId - id of project
	 * @param {number} limit - mongoose orm limit
	 * @param {number} offset - mongoose orm offset
	 * @returns {Object[]} collections for project
	 */
	async getCollections({ projectId, limit, offset }) {
		// TODO:
		// get paginated collections by project Id
		return Collection.findByProjectId(project._id);
	}

	/**
	 * Get project activity feed
	 */
	async getActivityFeed({ projectId, limit, offset }) {

		// TODO:
		// get activity feed from collections, items, articles, texts, and comments

	 return [];
	}
}
