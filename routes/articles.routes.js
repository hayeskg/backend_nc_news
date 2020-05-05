const articlesRouter = require('express').Router();
const { getArticle } = require('../controllers/articles.controller');

articlesRouter.get('/:article_id', getArticle);

module.exports = articlesRouter;