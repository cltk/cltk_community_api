import https from 'https';

const validateTokenOAuth2 = (accessToken, url) => new Promise((resolve, reject) => {

	https.get(`${url}?access_token=${accessToken}`, (res) => {
		const {
			statusCode
		} = res;

		console.log('statusCode', statusCode)

		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' +
				`Status Code: ${statusCode}`);
		}

		if (error) {
			console.error(error.message);
			// consume response data to free up memory
			res.resume();
			return;
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				resolve(parsedData);
			} catch (e) {
				console.error(e.message);
			}
		});
	}).on('error', (e) => {
		console.error(`Got error: ${e.message}`);
		reject(e);
	});
});

export default validateTokenOAuth2;
