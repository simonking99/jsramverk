import { getDb } from '../data/db/database.mjs';
import { ObjectId } from 'mongodb';

const data = {
    getAllDataForUser: async function (userId) {
        const db = getDb();
        return db.collection('documents').find({ owner: new ObjectId(userId) }).toArray();
    },
    createData: async function (userId, body) {
        const db = getDb();
        return db.collection('documents').insertOne({
            title: body.title,
            content: body.content,
            owner: new ObjectId(userId),
            sharedWith: []
        });
    },
    updateData: async function (docId, userId, body) {
        const db = getDb();
        return db.collection('documents').updateOne(
            { _id: new ObjectId(docId), owner: new ObjectId(userId) },
            { $set: { title: body.title, content: body.content } }
        );
    },
    deleteData: async function (docId, userId) {
        const db = getDb();
        return db.collection('documents').deleteOne({ _id: new ObjectId(docId), owner: new ObjectId(userId) });
    },
    shareDocument: async function (docId, userId, targetEmail) {
        const db = getDb();
        const targetUser = await db.collection('users').findOne({ email: targetEmail });
        if (!targetUser) throw new Error('Användare hittades inte');
    
        // Lägg till användaren i sharedWith med skrivbehörighet
        return db.collection('documents').updateOne(
            { _id: new ObjectId(docId), owner: new ObjectId(userId) },
            { $addToSet: { sharedWith: { userId: targetUser._id, permission: 'write' } } }
        );
    }
      
};

export default data;
