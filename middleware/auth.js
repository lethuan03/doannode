const jwtHelper = require("../utils/jwtHelper");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwtHelper.verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.userId = decoded.userId; // Save user id to request for later use
    next();
};

module.exports = authMiddleware;
