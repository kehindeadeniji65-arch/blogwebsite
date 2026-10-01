const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(401).json({ message: "Not authorized as an admin" });
    }
};

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // invalid token, just proceed as a guest
        }
    }
    next();
};

module.exports = { protect, admin, optionalAuth };
