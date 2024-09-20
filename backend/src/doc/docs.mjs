// docs.mjs
import { getDb } from '../../data/db/database.mjs';
import { ObjectId } from 'mongodb';

const docs = {
    getAll: async function getAll() {
        const db = getDb();
        try {
            return await db.collection('documents').find().toArray();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getOne: async function getOne(id) {
        const db = getDb();
        try {
            return await db.collection('documents').findOne({ _id: new ObjectId(id) });
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    addOne: async function addOne(body) {
        const db = getDb();
        try {
            const result = await db.collection('documents').insertOne({
                title: body.title,
                content: body.content
            });
            return result;
        } catch (e) {
            console.error(e);
        }
    },

    updateOne: async function updateOne(id, body) {
        const db = getDb();
        try {
            return await db.collection('documents').updateOne(
                { _id: new ObjectId(id) },
                { $set: { title: body.title, content: body.content } }
            );
        } catch (e) {
            console.error(e);
        }
    },
    deleteAll: async function deleteAll() {
        const db = getDb();
        try {
            return await db.collection('documents').deleteMany({});
        } catch (e) {
            console.error(e);
        }
    },
    add: function (a, b) {
        return a + b;
    }
};

export default docs;
