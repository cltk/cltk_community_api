import {Meteor} from 'meteor/meteor';
import PermissionsService from './PermissionsService';
import Example from '../../models/example';

export default class UserService extends PermissionsService {
	constructor(props) {
		super(props);
	}
	exampleUpdate(_id, example) {
    /**
     * Authentication
     */
		if (this.user) {
      /**
       * Validate permissions
       */

			if (this.hasExamplePermission()) {
        /**
         * Initiate item
         */
				const FoundExample = Example.findById(_id);
				if (!FoundExample) return new Error('Item not found');
			}

      /**
       * Perform action
       */

      // update item
			FoundExample.assign(example);

      // Save new item
			try {
				return FoundExample.save();
			} catch (err) {
				return new Error(err);
			}
		}
		return new Error('User not logged in');
	}
}
