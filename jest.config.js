// dotenv
const dotenvSetup = require('./dotenv');

dotenvSetup();

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['api/**/*.js']
};
