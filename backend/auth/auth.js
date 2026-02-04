
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

  
    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization token missing" });
    }

    
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token expired or invalid" });
  }
};



// Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Admin access only" });
  }
};

// User OR Admin
const userOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "user")
  ) {
    next();
  } else {
    return res.status(403).json({ msg: "Access denied" });
  }
};

module.exports = {
  authMiddleware,
  adminOnly,
  userOrAdmin,
};
