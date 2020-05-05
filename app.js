const express = require('express');
const app = express();
const apiRouter = require('./routes/api.routes')
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors/index.js');


app.use(express.json());
app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('/*', (req, res, next) =>
  next({ status: 404, msg: 'Route not found' })
);

module.exports = app;