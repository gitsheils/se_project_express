const jwt = require("jsonwebtoken");

const ErrorUnauthorized = require("../utils/ErrorUnauthorized");

module.exports = (req, res, next) => {
  const { JWT_SECRET = "dev-key" } = process.env;

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new ErrorUnauthorized("Authorization is required");
    /*
    return res
      .status(unauthorized)
      .send({ message: "Authorization is required" });
      */
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new ErrorUnauthorized("Authorization is required"));
  }
  req.user = payload;
  return next();
};
