const knex = require('../db/connection');

const fetchArticle = (article_id) => {
  if (!article_id) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${article_id}`,
    });
  }
  return knex.select('articles.*')
    .count('comments.article_id as comment_count')
    .from('articles')
    .orderBy('articles.article_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', article_id);

}

const updateArticle = (article_id, vote) => {
  return knex
    .select('votes')
    .from('articles')
    .where('article_id', '=', article_id)
    .then(votes => {
      const temp = parseInt(votes[0].votes) + vote;
      return knex
        .returning("*")
        .where({ article_id: article_id })
        .update({ votes: temp })
        .into('articles')
        .then(() => {
          if (!article_id) {
            return Promise.reject({
              status: 404,
              msg: `No article found for article_id: ${article_id}`,
            });
          }
          return fetchArticle(article_id)
        })

    })
}

module.exports = { fetchArticle, updateArticle }