const { fetchArticleByArticleId, updateArticleByArticleId, fetchCommentsByArticleId, fetchArticles, insertCommentByArticleId } = require('../models/articles.model');

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article });

    })
    .catch(next);
}

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleByArticleId(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticleId(username, article_id, body).then(comment => {
    res.status(201).send({ comment });
  })
    .catch(next);
}
