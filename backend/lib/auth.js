// Middleware JWT NOKOSKU
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'nokosku-secret';

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Login dulu untuk akses data.' });
    jwt.verify(token.replace('Bearer ','').trim(), SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token tidak valid. Silakan login ulang.' });
        req.user = decoded;
        next();
    });
};
