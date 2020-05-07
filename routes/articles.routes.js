const articlesRouter = require('express').Router();
const { getArticleByArticleId, patchArticleByArticleId, getCommentsByArticleId, getArticles } = require('../controllers/articles.controller');
const { handleMethodNotAllowed } = require('../errors/index');

articlesRouter.route('/')
  .get(getArticles)
  .all(handleMethodNotAllowed);

articlesRouter.route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticleByArticleId)
  .all(handleMethodNotAllowed);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .all(handleMethodNotAllowed);

module.exports = articlesRouter;