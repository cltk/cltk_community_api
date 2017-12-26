import dotenv from 'dotenv';
import faker from 'faker';
import winston from 'winston';

import setupDB, { closeDB } from '../src/mongoose';

import generateUsers from '../src/__seeds__/user';
import generateProjects from '../src/__seeds__/project';
import generateCollection from '../src/__seeds__/collection';
import generateItem from '../src/__seeds__/item';

dotenv.config();

const db = setupDB();

db.on('error', winston.error)
	.on('disconnected', setupDB)
	.once('open', async () => {
		winston.info(`Connected to mongodb ( host: ${db.host}, port: ${db.port}, name: ${db.name} )`);

		const ids = {};

		// generateUsers
		try {
			ids.users = await generateUsers(1);
		} catch (err) {
			winston.error(err);
		}
		winston.info('Generated users');

		// generate projects with users
		try {
			ids.projects = await generateProjects(100, ids.users);
		} catch (err) {
			winston.error(err);
		}
		winston.info('Generated projects');

		// generate collections for projects with itemSchemas
		try {
			ids.collections = await generateCollection(1000, ids.projects);
		} catch (err) {
			winston.error(err);
		}
		winston.info('Generated collections');

		// generate items
		try {
			ids.items = await generateItem(10000, ids.projects, ids.collections);
		} catch (err) {
			winston.error(err);
		}
		winston.info('Generated items');

		// end seed generation process
		db.close(() => {
			winston.log('Connection closed');
			process.exit(0);
		});
	});
