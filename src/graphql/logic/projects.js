import slugify from 'slugify';
import PermissionsService from './PermissionsService';
import Project from '../../models/project';

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
		// Initiate new project
		const NewProject = new Project(project);

		const projectUser = {
			userId: this.userId,
			role: 'admin',
		};

		NewProject.users.push(projectUser);

		// Validte permissions
		// check user permissions
		try {
			const userIsAdmin = await NewItem.validateUser(context.user._id);
			// if (!userIsAdmin) throw new PermissionError();
		} catch (err) {
			// throw new PermissionError();
		}

		return await NewProject.save();
	}

	/**
	 * Update a project
	 * @param {Object} project - project candidate
	 * @returns {Object} updated project
	 */
	async update(project) {
		// if user is not logged in
		if (!context.user) throw new AuthenticationError();

		// Initiate project
		const FoundProject = await Project.findById(projectId);
		if (!FoundProject) throw new ArgumentError({ data: { field: 'projectId' } });

		// validate permissions
		try {
			const userIsAdmin = await FoundProject.validateUser(context.user._id);
			if (!userIsAdmin) throw new PermissionsError();
		} catch (err) {
			throw new PermissionError();
		}

		// Perform action
		// update project
		Object.keys(project).forEach((key) => {
			FoundProject[key] = item[key];
		});

		// Save new project
		try {
			return await FoundProject.save();
		} catch (err) {
			handleMongooseError(err);
		}
	}

	/**
	 * Remove a project
	 * @param {string} _id - id of project to Remove
	 */
	async remove(_id) {
		// if user is not logged in
		if (!user) throw new AuthenticationError();

		// initiate project
		const FoundProject = await Project.findById(projectId);
		if (!FoundProject) throw new ArgumentError({ data: { field: 'projectId' } });

		// validate permissions
		// try {
		// 	const userIsAdmin = await FoundProject.validateUser(user._id);
		// 	if (!userIsAdmin) throw new PermissionError();
		// } catch (err) {
		// 	throw new PermissionError();
		// }

		// perform action
		// save new project
		try {
			await FoundProject.remove();
			return {
				_id: projectId,
			};
		} catch (err) {
			handleMongooseError(err);
		}
	}
}
