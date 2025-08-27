const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    // ✅ Skip preflight
    if (req.method === "OPTIONS") {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Akses ditolak. Token tidak ada atau tidak valid.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Token tidak valid atau kadaluarsa.",
        });
    }
};

module.exports = authenticate;
