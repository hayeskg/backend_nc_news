const knex = require('../db/connection');
const { isValuePresentInTableColumn } = require('./utils.model');

exports.fetchUser = (username) => {

  return isValuePresentInTableColumn('users', 'username', `${username}`)
    .then(userExists => {
      if (userExists) {
        return knex('users')
          .where('username', username)
          .then((user) => {
            return user;
          })
      } else {
        return Promise.reject({
          status: 404,
          msg: `non-existent username: ${username}`,
        });
      }
    })

}