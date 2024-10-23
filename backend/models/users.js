const { getDb } = require('../data/db/database');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const userModel = {
    createUser: async (userData) => {
        const db = getDb();
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = { ...userData, password: hashedPassword };
        return await db.collection('users').insertOne(user);
    },

    findUserByEmail: async (email) => {
        const db = getDb();
        return await db.collection('users').findOne({ email });
    },

    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    },
};

module.exports = userModel;
