const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.token || req.cookies.Cookie_3;
  if (!token) {
    return res.status(403).send({
      status:403, 
      message:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    res.clearCookie('token');
    res.end();
    return res.status(466).send({
      status:466,
      message:"session expire, please resignin",
      error: err
    });
  }
  return next();
};

const checkToken = (req, res, next) => {
  const token = req.cookies.token || req.cookies.Cookie_3;
  if (!token) req.user = undefined;
  else {
    try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      res.end();
      return res.status(466).send({
        status:466,
        message:"session expire, please resignin",
        error: err
      });
      
    }
  }
  return next();
}

module.exports = {verifyToken, checkToken};