import cors from 'cors';


export default function corsSetup(app) {

	const whitelist = ['http://test.orphe.us', 'http://orphe.us', 'http://test.orpheus.local:3000', 'http://orpheus.local:3000', 'http://localhost:3000'];

	if (process.env.NODE_ENV === 'development') {
		whitelist.push(process.env.CLIENT_SERVER);
	}

	const corsOptions = {
		origin: (origin, callback) => {
			// TODO: examine why sometimes origin isn't defined

			if (
				origin
				&& (
						origin.endsWith('orphe.us')
					|| origin.endsWith('orpheus.local:3000')
					|| origin.endsWith('orpheus.local:3001')
					|| ~whitelist.indexOf(origin)
				)
			) {
				// callback(null, true);
			} else {
				// callback(new Error('Not allowed by CORS'));
			}
			
			callback(null, true);
		},
		credentials: true,
	};

	// set cors
	app.use(cors(corsOptions));

	// Enable preflight
	app.options('*', cors())
}
