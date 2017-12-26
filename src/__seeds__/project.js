import faker from 'faker';

// models
import Project from '../models/project';

// utils
import { canSeed, generateData, insertData, notEmptyError, getRandom } from './utils';


const generateProjects = async (count, userIds) => {
	if (await canSeed(Project)) {

		const data = await generateData(count, async () => ({
			title: faker.lorem.words(),
			subtitle: faker.lorem.words(),
			hostname: faker.internet.domainName(),
			description: faker.lorem.sentences(),
			email: faker.internet.email(),
			url: faker.internet.url(),
			address: faker.address.streetAddress(),
			phone: faker.phone.phoneNumber(),
			users: [{
				userId: getRandom(userIds),
				role: 'admin',
			}],
		}));

		try {
			const projectIds = await insertData(data, Project, ['title']);
			return projectIds;
		} catch (err) {
			throw err;
		}
	}
	throw notEmptyError('Project');
};

export default generateProjects;
