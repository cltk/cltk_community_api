import Twitter from 'twitter';

const validateTokenOAuth1 = (network, accessToken, accessTokenSecret, url) => new Promise((resolve, reject) => {

	if (network === 'twitter') {
		const client = new Twitter({
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token_key: accessToken,
			access_token_secret: accessTokenSecret
		});

		client.get('account/verify_credentials', (error, response) => {
			if (error) reject(error);
			resolve(response);
		});
	}
});

export default validateTokenOAuth1;
