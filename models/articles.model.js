const knex = require('../db/connection');

const fetchArticle = (article_id) => {
  return knex.select('articles.*')
    .count('comments.article_id as comment_count')
    .from('articles')
    .orderBy('articles.article_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      } else {
        return article;
      }
    })
}

const updateArticle = (article_id, vote) => {
  return knex
    .select('votes')
    .from('articles')
    .where('article_id', '=', article_id)
    .then(votes => {
      if (votes.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      } else {
        const temp = parseInt(votes[0].votes) + vote;
        return knex
          .returning("*")
          .where({ article_id: article_id })
          .update({ votes: temp })
          .into('articles')
          .then(() => {
            return fetchArticle(article_id);
          })
      }
    });
}

const fetchCommentsByArticleId = (article_id, sorted_by, order) => {
  return knex.select('*')
    .from('comments')
    .orderBy(sorted_by || 'created_at', order || 'desc')
    .where('article_id', article_id)
    .then(comments => {
      console.log(comments);
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${article_id}`,
        });
      } else {
        return comments;
      }
    })
}

module.exports = { fetchArticle, updateArticle, fetchCommentsByArticleId }