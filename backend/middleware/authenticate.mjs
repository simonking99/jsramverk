import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Ingen token tillhandahölls' });

    const jwtSecret = process.env.JWT_SECRET;

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token ogiltig' });

        req.user = user;
        next();
    });
};

export default authenticate;
