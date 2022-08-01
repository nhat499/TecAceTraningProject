
function corHeader(req, res, next) {


  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin',  process.env.CLIENT_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,X-Auth-Token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
}

module.exports = corHeader;