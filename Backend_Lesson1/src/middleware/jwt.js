const dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
dotenv.config();

function authenticateToken(req, res, next) {
  if (req.url === "/login") return next();
  if (req.url === "/register") return next();
  if (req.url === "/upload") return next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
