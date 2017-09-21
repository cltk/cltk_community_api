import PermissionsService from './PermissionsService';
import Example from '../../models/example';

export default class ExampleService extends PermissionsService {
	constructor(props) {
		super(props);
	}

	exampleCreate(example) {
    /**
     * Authentication & Validate permissions
     */
		if (this.hasExamplePermission()) {
      /**
       * Initiate item
       */
			const NewExample = new Example(example);
      // save new item
			try {
				return NewExample.save();
			} catch (err) {
				return new Error(err);
			}
		}
	}

	exampleUpdate(_id, example) {
    /**
     * Authentication
     */
    // if (this.user) {
    /**
     * Validate permissions
     */

		if (this.hasExamplePermission()) {
      /**
       * Initiate item
       */
			return new Promise((resolve) => {
				Example.findByIdAndUpdate(_id, {$set: example}, (err, updatedExample) => {
					if (err) {
						resolve(new Error('Error updating', _id));
					}
					resolve(updatedExample);
				});
			});
		}
	}
}
