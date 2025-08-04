const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

async function verifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next(errorHandler(401, "Unauthorised"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "forbibben"));

    req.user = user;
    next();
  });
}
module.exports = {
  verifyUser,
};
