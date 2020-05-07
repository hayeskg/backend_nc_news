const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users.controller');
const { handleMethodNotAllowed, send404 } = require('../errors/index');

usersRouter.route('/:username')
  .get(getUser)
  .all(handleMethodNotAllowed);

usersRouter.all('/*', send404);

module.exports = usersRouter;