const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).send({
        message: "You are not authorized to access this resource",
      });
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next();
    }

    const userData = jwt.verify(accessToken, config.TOKEN_SECRET);
    if (!userData) {
      return next();
    }

    req.user = userData;
    next();
  } catch (e) {
    return next();
  }
};

module.exports = verifyToken;
