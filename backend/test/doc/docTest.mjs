import { strict as assert } from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import docs from '../../src/doc/docs.mjs';
import { connectToDb, getDb } from '../../data/db/database.mjs';

describe('docs module', function() {
    let mongoServer;
    let client;

    before(async function() {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        client = new MongoClient(uri);
        await client.connect();
        await connectToDb(uri);

    });

    after(async function() {
        await client.close();
        await mongoServer.stop();
    });

    it('should get all documents', async function() {
        const doc = { title: 'Sample', content: 'Content' };
        await docs.addOne(doc);
        const result = await docs.getAll();
        assert(Array.isArray(result));
        assert(result.some(d => d.title === doc.title && d.content === doc.content));
    });

    it('should get one document by id', async function() {
        const doc = { title: 'Sample', content: 'Content' };
        const { insertedId } = await docs.addOne(doc);
        const result = await docs.getOne(insertedId);
        assert.deepEqual(result, { ...doc, _id: insertedId });
    });

    it('should update one document', async function() {
        const { insertedId } = await docs.addOne({ title: 'Initial', content: 'Initial Content' });
        const id = insertedId;
        const body = { title: 'Updated Test', content: 'Updated Content' };
        const result = await docs.updateOne(id, body);
        assert(result.modifiedCount === 1);

        const updatedDoc = await docs.getOne(id);
        assert.deepEqual(updatedDoc, { ...body, _id: id });
    });

    it('should delete all documents', async function() {
        await docs.addOne({ title: 'To be deleted', content: 'Content' });
        const result = await docs.deleteAll();
        assert(result.deletedCount >= 0);

        const allDocs = await docs.getAll();
        assert(allDocs.length === 0);
    });
});
