const jwt = require("jsonwebtoken");

function validateToken(request, response, next) {
  const token = request.headers.authorization.replace("Bearer ", "");
  let result;
  if (token) {
    try {
      result = jwt.verify(token, process.env.SECRET);
      request.userId = result.userId;
      next();
    } catch (err) {
      throw new Error(err);
    }
  } else {
    result = {
      error: `Authentication error. Token required.`,
      status: 401
    };
    response.status(401).send(result);
  }
}

module.exports = validateToken;
