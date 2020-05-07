const knex = require('../db/connection');

const updateCommentById = (comment_id, vote) => {
  return knex
    .select('*')
    .from('comments')
    .where('comment_id', comment_id)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment ID: ${comment_id}`,
        });
      } else {
        const temp = parseInt(comments[0].votes) + vote;
        return knex
          .returning("*")
          .where({ comment_id: comment_id })
          .update({ votes: temp })
          .into('comments')
          .then(updatedComments => {
            return updatedComments;
          })
      }
    });
}

module.exports = { updateCommentById }