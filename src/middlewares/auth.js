const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("Token:", token);
    const decodedToken = jwt.verify(token, jwtSecret);
    console.log("Decoded Token:", decodedToken);
    req.userId = decodedToken.id;
    req.email = decodedToken.email;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
