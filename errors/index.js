exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ['22P02', '23502', '3F000', '42602', '42703', '42P01'];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  }
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handleMethodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};