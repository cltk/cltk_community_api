import cors from 'cors';

import DataLoader from 'dataloader';

// model
import Project from './models/project';


export default function corsSetup(app, redisClient) {

	const whitelist = ['http://generate-manifests.orphe.us'];

	if (process.env.NODE_ENV === 'development') {
		whitelist.push(process.env.CLIENT_SERVER);
	}

	// Check if project is white listed or in a database
	// Set the req.project value
	async function corsOptionsDelegate(req, callback) {
		const corsOptions = {
			origin: false,
			credentials: true,
		};

		const hostname = req.hostname;
		let project;
		// const project = await projectLoader.load(hostname);

		if (project) {
			corsOptions.origin = true;
			req.project = project;
		} else if (whitelist.indexOf(req.header('Origin')) !== -1) {
			corsOptions.origin = true;
			req.project = null;

			console.error('Project white listed but not in the database! Graphql may have limited functionality.');

			if (process.env.NODE_ENV === 'development') {
				// TODO - delete this and rewrite to generate a project on development and on start of server
				req.project = {
					title: 'Test Project',
					hostname: 'localhost',
					description: 'Test project description quid faciat laetas segetes',
					users: [],
				};
			}
		}

		callback(null, corsOptions);
	}

	// CORS:
	app.use(cors(corsOptionsDelegate));
}
