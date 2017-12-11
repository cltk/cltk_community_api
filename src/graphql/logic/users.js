import slugify from 'slugify';

// services
import PermissionsService from './PermissionsService';

// models
import User from '../../models/user';
import Project from '../../models/project';

// errors
import { AuthenticationError } from '../errors';


/**
 * Logic-layer service for dealing with users
 */

export default class UserService extends PermissionsService {

	/**
	 * Get user activity feed
	 * @param {number} limit - mongoose orm limit
	 * @param {number} offset - mongoose orm offset
	 * @returns {Object[]} activity feed items
	 */
	async getActivityFeed({ limit, offset }) {

		// TODO:
		// get activity feed from collections, items, articles, texts, and comments

	 return [];
	}

	/**
	 * Get user profile
	 * @returns {Object} currently logged in user profile
	 */
	async getProfile() {
		return await User.findOne({ _id: this.userId });
	}

	/**
	 * Update user profile
	 * @param {Object} user - user record
	 * @returns {Object} updated user result
	 */
	async update(user) {
		// if user is not logged in
		if (!this.userId) throw new AuthenticationError();

		// perform action
		User.update({ _id: this.userId }, { $set: user });

		// TODO
		// error handling

		// return updated project
		return await User.findOne({ _id: this.userId });
	}
}
