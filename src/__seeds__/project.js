import faker from 'faker';

// models
import Project from '../models/project';

// utils
import { canSeed, generateData, insertData, notEmptyError, getRandom } from './utils';


const generateProjects = async (count, userIds) => {
	if (await canSeed(Project)) {

		const data = await generateData(count, async () => ({
			title: faker.commerce.productName(),
			subdomain: 'localhost',
			description: faker.lorem.sentences(),
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
