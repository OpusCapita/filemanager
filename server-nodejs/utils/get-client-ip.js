module.exports = req =>
  // req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.ip;
