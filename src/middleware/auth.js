import jwt from 'jsonwebtoken';


const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: 'No access token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    code: 'TOKEN_EXPIRED',
                    message: 'Access token expired. Use refresh token to obtain a new one.',
                });
            }
            res.status(401).json({ message: 'Invalid access token' });
        }
    };
};

export default auth;
