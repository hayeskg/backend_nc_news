const knex = require('../db/connection');

exports.fetchArticle = (article_id) => {
  return knex.select('articles.*')
    .count('comments.article_id as comment_count')
    .from('articles')
    .orderBy('articles.article_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id');
}

// SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
// LEFT JOIN comments ON comments.article_id = articles.article_id
// GROUP BY articles.article_id;