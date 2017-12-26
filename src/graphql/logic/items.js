import _s from 'underscore.string';

// services
import PermissionsService from './PermissionsService';

// models
import Item from '../../models/item';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


/**
 * Logic-layer service for dealing with items
 */

export default class ItemService extends PermissionsService {
	/**
	 * Count items
	 * @param {string} collectionId
	 * @returns {number} count of items
	 */
	async count({ collectionId }) {

		if (!collectionId) {
			return 0;
		}

		return await Item.count({ collectionId });
	}

	/**
	 * Get a list of items
	 * @param {string} projectId
	 * @param {string} collectionId
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of items
	 */
	async getItems({ projectId, collectionId, textsearch, offset, limit }) {
		const args = {};

		if (!projectId && !collectionId) {
			return [];
		}

		if (projectId) {
			args.projectId = projectId;
		}

		if (collectionId) {
			args.collectionId = collectionId;
		}

		if (textsearch) {
			args.title = /.*${textsearch}.*/;
		}

		return await Item.find(args)
			.sort({ slug: 1})
			.skip(offset)
			.limit(limit);
	}

	/**
	 * Get item
	 * @param {string} collectionId - id of collection of item
	 * @param {number} _id - id of item
	 * @param {string} slug - slug of item
	 * @returns {Object[]} array of items
	 */
	async getItem({ collectionId, _id, slug }) {
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

		return await Item.findOne(where);
	}

	/**
	 * Create a new item
	 * @param {Object} item - item candidate
	 * @param {string} hostname - hostname of item project
	 * @returns {Object} created item
	 */
	async create(hostname, item) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// Initiate new item
		item.projectId = project._id;
		item.slug = _s.slugify(item.title);
		const newItem = new Item(item);

		// save new item
		return await newItem.save();
	}

	/**
	 * Update a item
	 * @param {Object} item - item candidate
	 * @returns {Object} updated item
	 */
	async update(item) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne(item.projectId);
		if (!project) throw new ArgumentError({ data: { field: 'item.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Item.update({ _id: item._id }, { $set: item });

		// TODO
		// error handling

		// return updated item
		return await Item.findById(item._id);
	}

	/**
	 * Remove a item
	 * @param {string} _id - id of item to Remove
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
		const result = await Item.remove({ _id });

		// TODO
		// error handling

		// respond with result
		return {
			result,
		};
	}

	/**
	 * Get item activity feed
	 * @param {number} itemId - item id for activity
	 * @param {number} limit - mongoose orm limit
	 * @param {number} offset - mongoose orm offset
	 * @returns {Object[]} activity feed items
	 */
	async getActivityFeed({ itemId, limit, offset }) {

		// TODO:
		// get activity feed from items, items, articles, texts, and comments

		return [];
	}
}
