const apiRouter = require('express').Router();
const topicsRouter = require('./topics.routes');
const usersRouter = require('./users.routes');
const articlesRouter = require('./articles.routes');
const commentsRouter = require('./comments.routes');
const { handleMethodNotAllowed } = require('../errors/index');



apiRouter.use('/topics', topicsRouter).all(handleMethodNotAllowed);
apiRouter.use('/users', usersRouter).all(handleMethodNotAllowed);
apiRouter.use('/articles', articlesRouter).all(handleMethodNotAllowed);
apiRouter.use('/comments', commentsRouter).all(handleMethodNotAllowed);

apiRouter.all('/', handleMethodNotAllowed);

module.exports = apiRouter;