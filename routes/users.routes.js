const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users.controller');

usersRouter.get('/:username', getUser);

module.exports = usersRouter;