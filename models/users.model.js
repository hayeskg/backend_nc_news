const knex = require('../db/connection');

exports.fetchUser = (username) => {
  if (!username) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${username}`,
    });
  }
  return knex('users').where('username', username);

}