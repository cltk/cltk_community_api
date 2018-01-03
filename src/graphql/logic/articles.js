import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Article from '../../models/article';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError, ArgumentError } from '../errors';


/**
 * Logic-layer service for dealing with articles
 */

export default class ArticleService extends PermissionsService {
	/**
	 * Count articles
	 * @param {string} projectId
	 * @returns {number} count of articles
	 */
	async count({ projectId }) {
		return await Article.count({ projectId });
	}

	/**
	 * Get a list of articles
	 * @param {string} projectId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of articles
	 */
	async getArticles({ projectId, textsearch, offset, limit }) {
		const args = { projectId };

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Article.find(args)
			.sort({ slug: 1})
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get article
	 * @param {string} projectId - id of the parent project for the article
	 * @param {number} _id - id of article
	 * @param {string} slug - slug of article
	 * @returns {Object[]} array of articles
	 */
	async getArticle({ projectId, _id, slug, }) {
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

		return await Article.findOne(where);
	}

	/**
	 * Save an article while users are editing
	 * @param {string} hostname - hostname of the article for the project
	 * @param {Object} article - article candidate
	 * @returns {Object} updated article
	 */
	async save(hostname, article) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		const articleProject = await Project.findOne({ hostname });

		// Initiate project
		if (!articleProject) throw new ArgumentError({ data: { field: 'project.hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(articleProject);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const existingArticle = await Article.findOne({ _id: article._id });
		let result;
		if (existingArticle) {
			// perform action
			article.slug = _s.slugify(article.title);
			result = await Article.update({ _id: article._id }, { $set: article });
		} else {
			// set article projectid and slug
			article.projectId = articleProject._id;
			article.slug = _s.slugify(article.title);

			// Initiate new article
			const newArticle = new Article(article);
			result = await newArticle.save();
		}

		// TODO
		// error handling

		// return updated article
		return result;
	}

	/**
	 * Create a new article
	 * @param {string} hostname - hostname of the article for the project
	 * @param {Object} article - article candidate
	 * @returns {Object} created article
	 */
	async create(hostname, article) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		const articleProject = await Project.findOne({ hostname });

		// Initiate project
		if (!articleProject) throw new ArgumentError({ data: { field: 'project._id' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(articleProject);
		if (!userIsAdmin) throw new PermissionError();

		// set article projectid and slug
		article.projectId = articleProject._id;
		article.slug = _s.slugify(article.title);

		// Initiate new article
		const newArticle = new Article(article);

		// save new article and return result
		return await newArticle.save();
	}

	/**
	 * Update a article
	 * @param {Object} article - article candidate
	 * @returns {Object} updated article
	 */
	async update(article) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findOne({ _id: article.projectId });
		if (!project) throw new ArgumentError({ data: { field: 'article.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Article.update({ _id: article._id }, { $set: article });

		// TODO
		// error handling

		// return updated article
		return await Article.findById(article._id);
	}

	/**
	 * Remove a article
	 * @param {string} _id - id of article to Remove
	 * @param {string} hostname - hostname of project to check permissions against
	 * @returns {boolean} remove result
	 */
	async remove(_id, hostname) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// get project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'article.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Article.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}

}
