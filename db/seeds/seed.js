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
      //   /* 

      //   Your comment data is currently in the incorrect format and will violate your SQL schema. 

      //   Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 

      //   You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      //   */

      const formattedComments = formatComments(commentData, articleLookup, 'article_id', 'belongs_to');
      return knex('comments').insert(formattedComments);
    });
};
