const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const config = require('../config');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user || !(await userModel.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Felaktiga inloggningsuppgifter' });
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Inloggning misslyckades' });
    }
};
