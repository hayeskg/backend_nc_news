const { fetchArticleByArticleId, updateArticleByArticleId, fetchCommentsByArticleId, fetchArticles } = require('../models/articles.model');

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article: article[0] });

    })
    .catch(next);
}

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleByArticleId(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sorted_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sorted_by, order)
    .then(comments => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
  const { sorted_by, order, author, topic } = req.query;
  fetchArticles(sorted_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
}
