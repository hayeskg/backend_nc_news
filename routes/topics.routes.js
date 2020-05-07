const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics.controller');
const { handleMethodNotAllowed, send404 } = require('../errors/index');

topicsRouter.route('/')
  .get(getTopics)
  .all(handleMethodNotAllowed);

topicsRouter.all('/*', send404);

module.exports = topicsRouter;