const knex = require('../db/connection');

const { isValuePresentInTableColumn } = require('./utils.model');

const fetchArticleByArticleId = (article_id) => {
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

const updateArticleByArticleId = (article_id, vote) => {
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
            return fetchArticleByArticleId(article_id);
          })
      }
    });
}

const fetchCommentsByArticleId = (article_id, sorted_by, order) => {
  const articleExistsPromise = isValuePresentInTableColumn('articles', 'article_id', `${article_id}`)

  return articleExistsPromise
    .then((articleExists) => {
      if ((article_id) && articleExists === false) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${article_id}`,
        });
      } else {
        return knex
          .select('*')
          .from('comments')
          .orderBy(sorted_by || 'created_at', order || 'desc')
          .where('article_id', article_id)
      }
    })
    .then((comments) => {
      return comments;
    })

}

const fetchArticles = (sorted_by, order, author, topic) => {
  const authorExistsPromise = isValuePresentInTableColumn('users', 'username', `${author}`);
  const topicExistsPromise = isValuePresentInTableColumn('topics', 'slug', `${topic}`);

  return Promise.all([authorExistsPromise, topicExistsPromise])
    .then((results) => {
      if ((author) && results[0] === false) {
        return Promise.reject({
          status: 404,
          msg: 'Bad Request - invalid query.',
        });
      } else if ((topic) && results[1] === false) {
        return Promise.reject({
          status: 404,
          msg: 'Bad Request - invalid query.',
        });
      } else {
        return knex.select('articles.*')
          .count('comments.article_id as comment_count')
          .from('articles')
          .orderBy(sorted_by || 'articles.created_at', order || 'desc')
          .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
          .groupBy('articles.article_id')
          .modify(query => {
            if (author) query.where('articles.author', author);
            if (topic) query.where('articles.topic', topic);
          })
      }
    })
    .then((articles) => {
      return articles;
    })

}

const insertCommentByArticleId = (username, article_id, body) => {
  const userExistsPromise = isValuePresentInTableColumn('users', 'username', `${username}`);
  const articleIdExistsPromise = isValuePresentInTableColumn('articles', 'article_id', `${article_id}`);

  return Promise.all([userExistsPromise, articleIdExistsPromise])
    .then(([userValid, articleIdValid]) => {
      if (userValid === true && articleIdValid === true) {
        return knex('comments')
          .returning("*")
          .insert({ article_id: article_id, author: username, body: body })
          .into('comments')
          .then((comment) => {
            return comment[0];
          })
      } else if (articleIdValid === false) {
        return Promise.reject({
          status: 404,
          msg: 'Article ID not found.',
        });
      } else {
        return Promise.reject({
          status: 400,
          msg: `Not possible to post comment.`,
        });
      }
    })
}


module.exports = { fetchArticleByArticleId, updateArticleByArticleId, fetchCommentsByArticleId, fetchArticles, insertCommentByArticleId }




