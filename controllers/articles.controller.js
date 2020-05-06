const { fetchArticle, updateArticle, fetchCommentsByArticleId } = require('../models/articles.model');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id).then(article => {
    res.status(200).send({ article: article[0] });

  })
    .catch(next);
}

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes).then(article => {
    res.status(200).send({ article: article[0] });
  })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sorted_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sorted_by, order).then(comments => {
    res.status(200).send({ comments: comments });
  })
    .catch(next);
}