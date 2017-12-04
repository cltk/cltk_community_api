// dotenv
const dotenvSetup = require('./src/dotenv');

dotenvSetup();

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js']
};
