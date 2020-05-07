const commentsRouter = require('express').Router();
const { patchCommentById } = require('../controllers/comments.controller');
const { handleMethodNotAllowed } = require('../errors/index');

commentsRouter.route('/:comment_id').patch(patchCommentById).all(handleMethodNotAllowed);

module.exports = commentsRouter;