const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { JWT_SECRET } = process.env;

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.send({ message: "Authorization is required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Authorization is required" });
  }
  req.user = payload;
  return next();
};
