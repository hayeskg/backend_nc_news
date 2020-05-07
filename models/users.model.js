const knex = require('../db/connection');

exports.fetchUser = (username) => {
  return knex('users')
    .where('username', username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: `non-existent username: ${username}` });
      } else {
        return user;
      }
    });

}