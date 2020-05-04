const ENV = process.env.NODE_ENV || 'development';

const testData = require('./test-data/index');
const developmentData = require('./development-data/index');

const data = {
  development: developmentData,
  test: testData
};

module.exports = data[ENV];