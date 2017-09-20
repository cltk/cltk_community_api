const providers = {
	facebook: {
		url: 'https://graph.facebook.com/me',
		userIdField: 'id',
	},
	google: {
		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
		userIdField: 'sub',
	},
	twitter: {
		url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
		userIdField: 'id',
	}
};

export default providers;
