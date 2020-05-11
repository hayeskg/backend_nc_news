const knex = require('../db/connection');

const updateCommentById = (comment_id, vote) => {
  return knex
    .returning("*")
    .where({ comment_id: comment_id })
    .increment({ votes: vote })
    .into('comments')
    .then(updatedComments => {
      if (updatedComments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment ID: ${comment_id}`,
        });
      } else {
        return updatedComments[0];
      }
    })
}

const removeCommentById = (comment_id) => {
  return knex
    .del()
    .from('comments')
    .where('comment_id', comment_id)
    .then((delCount) => {
      if (delCount === 0) return Promise.reject({ status: 404, msg: 'Comment not found.' })
    })
}

module.exports = { updateCommentById, removeCommentById }