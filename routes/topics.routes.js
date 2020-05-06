const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics.controller');

topicsRouter.route('/').get(getTopics).all((req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
})
// topicsRouter.all('/*', (req, res, next) => {
//   res.status(405).send({ msg: 'Method not allowed' })
// });

module.exports = topicsRouter;