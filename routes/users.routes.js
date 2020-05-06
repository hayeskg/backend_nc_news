const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users.controller');

usersRouter.route('/:username').get(getUser).all((req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
});

module.exports = usersRouter;