const articlesRouter = require('express').Router();
const { getArticle, patchArticle } = require('../controllers/articles.controller');

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticle).all((req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
});;

module.exports = articlesRouter;