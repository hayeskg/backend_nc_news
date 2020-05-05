const dbConfig = require('../knexfile');
const knex = require('knex')(dbConfig);

module.exports = knex;