const jwtHelper = require("../utils/jwtHelper");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwtHelper.verifyToken(token);

    console.log(">>> decoded token:", decoded); // 👈 thêm dòng này để debug

    if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = { _id: decoded.id }; // ✅ đúng vì token có "id"

    next();
};
module.exports = authMiddleware;