const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided. Please login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid or expired token." });
    }
};


const authMiddleware = {
    verifyToken
};

module.exports = authMiddleware;