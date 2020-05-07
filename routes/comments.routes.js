const commentsRouter = require('express').Router();
const { patchCommentById, deleteCommentById } = require('../controllers/comments.controller');
const { handleMethodNotAllowed, send404 } = require('../errors/index');

commentsRouter.route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handleMethodNotAllowed);

commentsRouter.all('/*', send404);

module.exports = commentsRouter;