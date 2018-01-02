import _s from 'underscore.string';
import shortid from 'shortid';
import rp from 'request-promise';
import request from 'request';

// services
import PermissionsService from './PermissionsService';

// models
import Item from '../../models/item';
import File from '../../models/file';
import Manifest from '../../models/manifest';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


const saveFiles = async (project, item, files) => {

	const existingFiles = await File.find({
		itemId: item._id
	});

	// remove all existing files
	existingFiles.forEach(async (existingFile) => {
		await File.remove({
			_id: existingFile._id,
		});
	});

	files.forEach(async (file) => {
		if (!('_id' in file)) {
			file._id = shortid.generate();
		}

		// relationships
		file.itemId = item._id;
		file.projectId = project._id;

		const newFile = new File(file);
		await newFile.save();
	});
};


const saveManifest = async (project, item, files) => {
	const images = [];
	files.forEach((file) => {
		let newImageName = file.name;
		newImageName = newImageName.replace(`${file._id}-`, '');

		images.push({
			_id: file._id,
			name: newImageName,
			label: file.title,
		});
	});

	// update item manifest
	const manifest = {
		itemId: item._id,
		title: item.title,
		label: item.title,
		description: item.description || '',
		attribution: project.title,
		images,
	};

	let existingManifest = await Manifest.findOne({ itemId: manifest.itemId });
	if (!existingManifest) {
		existingManifest = new Manifest(manifest);
		await existingManifest.save();
		existingManifest = await Manifest.findOne({ itemId: manifest.itemId });
	} else {
		await Manifest.update({
			itemId: manifest.itemId,
		}, {
			$set: manifest
		});
	}

	manifest._id = existingManifest._id;
	const manifestCreationResult = await request.post('http://generate-manifests.orphe.us/manifests', {
		form: {
			manifest: JSON.stringify(manifest),
			responseUrl: process.env.MANIFEST_RESPONSE_URL,
		},
	});
};


/**
 * Logic-layer service for dealing with items
 */

export default class ItemService extends PermissionsService {
	/**
	 * Count items
	 * @param {string} projectId
	 * @param {string} collectionId
	 * @returns {number} count of items
	 */
	async count({ projectId, collectionId }) {
		const where = {};

		if (!projectId && !collectionId) {
			return 0;
		}

		if (projectId) {
			where.projectId = projectId;
		}

		if (collectionId) {
			where.collectionId = collectionId;
		}

		return await Item.count(where);
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
	 * @param {[Object]} files - files for the object
	 * @returns {Object} created item
	 */
	async create(hostname, item, files) {
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

		await newItem.save();

		if (files) {
			await saveFiles(project, newItem, files);
			await saveManifest(project, newItem, files);
		}

		// return new item
		return newItem;
	}

	/**
	 * Update a item
	 * @param {Object} item - item candidate
	 * @returns {Object} updated item
	 */
	async update(item, files) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// find project
		const project = await Project.findOne({ _id: item.projectId });
		if (!project) throw new ArgumentError({ data: { field: 'item.projectId' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		// perform action
		const result = await Item.update({ _id: item._id }, { $set: item });
		const updatedItem = await Item.findById(item._id);

		// save files and add ids to item
		if (files) {
			await saveFiles(project, updatedItem, files);
			await saveManifest(project, updatedItem, files);
		}

		// TODO
		// error handling

		// return updated item
		return updatedItem;
	}

	/**
	 * Remove a item
	 * @param {string} _id - id of item to Remove
	 * @param {string} hostname - hostname of project to check permissions against
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
