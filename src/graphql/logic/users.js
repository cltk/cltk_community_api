import slugify from 'slugify';

// services
import PermissionsService from './PermissionsService';

// models
import User from '../../models/user';
import Project from '../../models/project';

// errors
import { AuthenticationError, PermissionError } from '../errors';


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
	 * Get project
	 * @param {number} _id - id of project
	 * @returns {Object} user record
	 */
	async getUser({ _id }) {
		const where = {};

		if (!_id) {
			return null;
		}

		if (_id) {
			where._id = _id;
		}

		return await User.findOne(where);
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
		const result = await User.update({ _id: this.userId }, { $set: user });

		// TODO
		// error handling

		// return updated project
		return await User.findOne({ _id: this.userId });
	}

	/**
	 * Check if user is admin for project
	 * @param {Object} project - project to compare against
	 * @returns {boolean} if the user is an admin on the current project
	 */
	async userIsAdmin({ project }) {
		// if user is not logged in or there is no project
		if (!this.userId || !project) {
			return false;
		}

		// return updated project
		return this.userIsProjectAdmin(project);
	}

	/**
	 * Check if provided user id is the id of the signed in user
	 * @param {string} _id - user id to check
	 * @returns {boolean} if the user is an admin on the current project
	 */
	async userIsActiveUser(_id) {
		// if user is not logged in
		if (!this.userId) {
			return false;
		}

		// return if the user who made this request is the parent user object requested
		return (_id === this.userId);
	}

	/**
	 * Invite a user to join project via email (with captcha)
	 * @param {string} userEmail - user Email to invite to join
	 * @param {string} role - invited user role
	 * @param {string} recaptchaVerification - recaptcha verification to prevent bots
	 * @param {string} hostname - project hostname to invite user to
	 * @returns {boolean} if the invitiation has been sent successfully
	 */
	async invite({ userEmail, role, recaptchaVerification, hostname }) {
		// if user is not logged in
		if (!this.userId) {
			return false;
		}

		// TODO: if recaptchaVerification fails
		if (!recaptchaVerification) {
			return false;
		}

		// find project
		const project = await Project.findOne({ hostname });
		if (!project) throw new ArgumentError({ data: { field: 'hostname' } });

		// validate permissions
		const userIsAdmin = this.userIsProjectAdmin(project);
		if (!userIsAdmin) throw new PermissionError();

		let user = await User.findOne({ email: userEmail });

		if (!user) {
			user = new User({
				email: userEmail,
				username: userEmail,
				name: userEmail,
			});
			await user.save();
			user = await User.findOne({ email: userEmail });
		}

		const result = await Project.update({
			_id: project._id,
		}, {
			$push: {
				users: {
					userId: user._id,
					role: 'admin',
					status: 'pending',
				}
			}
		});

		return result;
	}
}
