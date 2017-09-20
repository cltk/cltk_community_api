import dotenv from 'dotenv';
import faker from 'faker';

import setupDB, { closeDB } from '../mongoose';

import generateUsers from '../__seeds__/user';
import generateProjects from '../__seeds__/project';
import generateCollection from '../__seeds__/collection';
import generateItem from '../__seeds__/item';

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
			ids.collectionIds = await generateCollection(25, ids.projects);
		} catch (err) {
			console.error(err);
		}

		// generate items
		try {
			ids.itemIds = await generateItem(100, ids.collectionIds);
		} catch (err) {
			console.error(err);
		}

		// end seed generation process
		db.close(() => {
			console.log('Connection closed');
			process.exit(0);
		});
	});
