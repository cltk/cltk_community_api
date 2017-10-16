import faker from 'faker';

// models
import Collection from '../models/collection';

// utils
import { canSeed, generateData, insertData, notEmptyError, getRandom } from './utils';


const generateCollection = async (count, projectIds) => {

	if (await canSeed(Collection)) {
		const data = await generateData(count, async() => ({
			title: faker.commerce.productName(),
			description: faker.lorem.sentences(),
			projectId: getRandom(projectIds),
		}));

		try {
			const collectionIds = await insertData(data, Collection, ['title']);
			return collectionIds;
		} catch (err) {
			throw err;
		}
	}

	throw notEmptyError('Collection');
};

export default generateCollection;
