const knex = require('../db/connection');

exports.fetchUser = (username) => {
  return knex('users').where('username', username);
}