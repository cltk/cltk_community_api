import dotenv from 'dotenv';

import setupDB, { closeDB } from '../src/mongoose';

dotenv.config();

const db = setupDB();

db.on('error', console.error)
	.on('disconnected', setupDB)
	.once('open', async () => {
		console.info(`Connected to mongodb ( host: ${db.host}, port: ${db.port}, name: ${db.name} )`);

		try {
			const listCollectionsCursor = await db.db.listCollections();
			const models = await listCollectionsCursor.toArray();

			await Promise.all(models.map(async (model) => {
				try {
					if (model.name.indexOf('system') !== 0) {
						await db.db.dropCollection(model.name);
					}
				} catch (err) {
					console.error(err);
				}
			}));

		} catch (err) {
			console.error(err);
		}

		// end seed generation process
		db.close(() => {
			console.log('Connection closed');
			process.exit(0);
		});
	});
