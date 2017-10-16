import cors from 'cors';

import DataLoader from 'dataloader';

// model

export default function corsSetup(app) {

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

		if (whitelist.indexOf(req.header('Origin')) !== -1) {
			corsOptions.origin = true;
		}

		callback(null, corsOptions);
	}

	// CORS:
	app.use(cors(corsOptionsDelegate));
}
