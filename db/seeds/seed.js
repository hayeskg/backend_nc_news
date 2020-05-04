const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {
  const topicsInsertions = knex('topics').insert(topicData);
  const usersInsertions = knex('users').insert(userData);
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticleData = formatDates(articleData, 'created_at');
      formattedArticleData.forEach((article) => {
        if (!article.votes) {
          article.votes = 0;
        }
      });
      return knex('articles')
        .insert(formattedArticleData)
        .returning('*')
    })
    .then(articleRows => {
      const articleLookup = makeRefObj(articleRows, 'article_id', 'title');
      const formattedComments = formatComments(commentData, articleLookup, 'article_id', 'belongs_to');
      return knex('comments').insert(formattedComments);
    });
};
