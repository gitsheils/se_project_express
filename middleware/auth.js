const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { JWT_SECRET = "dev-key" } = process.env;

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(unauthorized)
      .send({ message: "Authorization is required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(unauthorized)
      .send({ message: "Authorization is required" });
  }
  req.user = payload;
  return next();
};
