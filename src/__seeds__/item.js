import faker from 'faker';
import shortid from 'shortid';
import _ from 'underscore';

// models
import Item, { metadataTypes } from '../models/item';

// utils
import { canSeed, generateData, insertData, notEmptyError, getRandom } from './utils';




const generateMetadata = () => {
	const count = Math.floor(Math.random() * 5);
	const metadata = [];
	for (let i = 0; i < count; i += 1) {
		const label = faker.lorem.word();
		const type = _.sample(metadataTypes);
		const value = faker.helpers.slugify(label);
		metadata.push({
			type,
			value,
			label,
		});
	}
	return metadata;
};

const generateItem = async (count, projectIds, collectionIds) => {

	if (await canSeed(Item)) {
		const data = await generateData(count, async() => ({
			title: faker.lorem.words(),
			description: faker.lorem.sentences(),
			projectId: getRandom(projectIds),
			collectionId: getRandom(collectionIds),
			metadata: generateMetadata(),
		}));

		try {
			const itemIds = await insertData(data, Item, ['title']);
			return itemIds;
		} catch (err) {
			throw err;
		}
	}

	throw notEmptyError('Item');
};

export default generateItem;
