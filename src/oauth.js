import oauthshim from 'oauth-shim';

const oauthSetup = (app) => {

	app.all('/oauthproxy', oauthshim);

	const twitterProxy = {
		// id : 'secret',
		client_id: process.env.TWITTER_CONSUMER_KEY,
		client_secret: process.env.TWITTER_CONSUMER_SECRET,
		// Define the grant_url where to exchange Authorisation codes for tokens
		grant_url: process.env.TWITTER_API_ENDPOINT,
	};

	oauthshim.init([twitterProxy]);
};

export default oauthSetup;
