import { getDb } from '../../data/db/database.mjs';
import { ObjectId } from 'mongodb';

const docs = {
    getAllByUser: async (userId) => {
        const db = getDb();
        return await db.collection('documents').find({ userId }).toArray();
    },

    getAllShared: async (userId) => {
        const db = getDb();
        
        const objectIdUserId = new ObjectId(userId);

        return await db.collection('documents').find({
            sharedWith: objectIdUserId
        }).toArray();
    },

    getOne: async (id) => {
        const db = getDb();
        return await db.collection('documents').findOne({ _id: new ObjectId(id) });
    },

    addOne: async (documentData) => {
        const db = getDb();
        return await db.collection('documents').insertOne(documentData);
    },

    updateOne: async (id, updateData) => {
        const db = getDb();
        return await db.collection('documents').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
    },

    deleteAllByUser: async (userId) => {
        const db = getDb();
        return await db.collection('documents').deleteMany({ userId });
    },

    share: async (documentId, userId) => {
        const db = getDb();
        return await db.collection('documents').updateOne(
            { _id: new ObjectId(documentId) },
            { $addToSet: { sharedWith: userId } }
        );
    },

    copyDocumentId: async (id) => {
        const db = getDb();
        const document = await db.collection('documents').findOne({ _id: new ObjectId(id) });
        if (document) {
            return document._id.toString();
        }
        throw new Error('Dokumentet hittades inte');
    },

    getAllDocuments: async () => {
        const db = getDb();
        return await db.collection('documents').find({}).toArray();
    },

};

export default docs;
