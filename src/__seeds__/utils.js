import shortid from 'shortid';

export const canSeed = async Model => Model.count().exec().then(count => count === 0);

export const generateData = (DATA_COUNT, getDataStructure) => {
	const iterator = Array.from(Array(DATA_COUNT));

	return Promise.all(iterator.map(async () => {
		try {
			const data = await getDataStructure();
			return data;
		} catch (err) {
			throw err;
		}
	}));
};

export const insertData = async (data, Model, uniqueFields) => Promise.all(
	data.map(async (item) => {
		try {
			const newElement = new Model(item);
			const element = await newElement.save();
			return element._id;
		} catch (err) {
			// duplicate key error
			if (err.name === 'MongoError' && err.code === 11000) {

				const newItem = Object.assign(item);

				if (uniqueFields) {
					uniqueFields.forEach((field) => {
						newItem[field] = `${item[field]} ${shortid.generate()}`;
					});
				}

				try {
					const newElement2 = new Model(newItem);
					const element2 = await newElement2.save();
					return element2._id;
				} catch (err2) {
					throw err2;
				}
			}

			throw err;
		}
	})
);

export const notEmptyError = modal => new Error(`Can not generate seeds - ${modal} collection is not empty`);

export const getRandom = array => array[Math.floor(Math.random() * array.length)];
