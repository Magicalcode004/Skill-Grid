const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkauth = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).send({ error: "Access Denied! Valid token required." });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid Token" });
    }
};

module.exports = checkauth;