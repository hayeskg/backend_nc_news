const knex = require('../db/connection');
const { isValuePresentInTableColumn } = require('./utils.model');

exports.fetchUser = (username) => {

  return knex('users')
    .where('username', username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Username: ${username} doesn't exist.`,
        });
      } else {
        return user[0];
      }
    })
}