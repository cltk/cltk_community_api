import dotenv from 'dotenv';
import faker from 'faker';

import setupDB, { closeDB } from '../src/mongoose';

import generateUsers from '../src/__seeds__/user';
import generateProjects from '../src/__seeds__/project';
import generateCollection from '../src/__seeds__/collection';
import generateItem from '../src/__seeds__/item';

dotenv.config();

const db = setupDB();

db.on('error', console.error)
	.on('disconnected', setupDB)
	.once('open', async () => {
		console.info(`Connected to mongodb ( host: ${db.host}, port: ${db.port}, name: ${db.name} )`);

		const ids = {};

		// generateUsers
		try {
			ids.users = await generateUsers(10);
		} catch (err) {
			console.error(err);
		}

		// generate projects with users
		try {
			ids.projects = await generateProjects(10, ids.users);
		} catch (err) {
			console.error(err);
		}

		// generate collections for projects with itemSchemas
		try {
			ids.collections = await generateCollection(25, ids.projects);
		} catch (err) {
			console.error(err);
		}

		// generate items
		try {
			ids.items = await generateItem(100, ids.projects, ids.collections);
		} catch (err) {
			console.error(err);
		}

		// end seed generation process
		db.close(() => {
			console.log('Connection closed');
			process.exit(0);
		});
	});
