import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../data/db.js';

const secretKey = process.env.JWT_SECRET;

const auth = {
    login: async (email, password) => {
        const db = getDb();
        const user = await db.collection('users').findOne({ email });
        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Invalid password');

        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        return { token };
    },
    register: async (email, password) => {
        const db = getDb();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword };
        const result = await db.collection('users').insertOne(newUser);
        return result;
    }
};

export default auth;