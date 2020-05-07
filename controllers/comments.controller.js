const { updateCommentById } = require('../models/comments.model');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(comments => {
      res.status(200).send({ comment: comments[0] })
    })
    .catch(next);
}