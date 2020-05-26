const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api.routes')
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleMethodNotAllowed,
  send404,
} = require('./errors/index.js');

app.use(cors());


app.use(express.json());
app.use('/api', apiRouter).all(handleMethodNotAllowed);

app.all('/*', send404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app;