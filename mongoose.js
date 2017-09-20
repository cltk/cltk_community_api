import mongoose from 'mongoose';
import assert from 'assert';
// session store
import createMongoDBStore from 'connect-mongodb-session';


// Use native promises
mongoose.Promise = global.Promise;

const getURL = () => {
	const DB_HOST = process.env.DB_HOST;
	const DB_PORT = process.env.DB_PORT;
	const DB_NAME = process.env.DB_NAME;
	const DB_USER = process.env.DB_USER;
	const DB_PASS = process.env.DB_PASS;

	if (DB_USER && DB_PASS) {
		return `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
	}

	return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

const closeDB = () => {
	mongoose.disconnect();
	console.log('database closed');
};

/**
 * Sets up the mongoose connection based on the process.env settings.
 * @return {function} mongoose connection instance
 */
const dbSetup = () => {

	const url = getURL();

	const options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		},
	};

	if (process.env.NODE_ENV === 'development') {
		mongoose.set('debug', true);
	}

	return mongoose.connect(url, options).connection;
};

const storeSetup = (session) => {

	const uri = getURL();

	const MongoDBStore = createMongoDBStore(session);

	const store = new MongoDBStore({
		uri,
		collection: 'session',
	});

	// Catch errors
	store.on('error', (error) => {
		assert.ifError(error);
		assert.ok(false);
	});

	return store;
};

export default dbSetup;
export { getURL, closeDB, storeSetup };
