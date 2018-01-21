import dotenv from 'dotenv';
import faker from 'faker';
import winston from 'winston';

import setupDB, { closeDB } from '../src/mongoose';

import generateUsers from '../src/__seeds__/user';

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

		// end seed generation process
		db.close(() => {
			winston.log('Connection closed');
			process.exit(0);
		});
	});
