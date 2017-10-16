import faker from 'faker';
import shortid from 'shortid';

// models
import Item from '../models/item';

// utils
import { canSeed, generateData, insertData, notEmptyError, getRandom } from './utils';

const generateMetadata = () => {
	const count = Math.floor(Math.random() * 5);
	const metadata = [];
	for (let i = 0; i < count; i += 1) {
		const label = faker.lorem.word();
		const value = faker.helpers.slugify(label);
		metadata.push({
			value,
			label,
		});
	}
	return metadata;
};

const generateItem = async (count, collectionIds) => {

	if (await canSeed(Item)) {
		const data = await generateData(count, async() => ({
			title: faker.commerce.productName(),
			description: faker.lorem.sentences(),
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
