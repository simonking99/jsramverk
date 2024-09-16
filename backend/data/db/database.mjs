import { MongoClient } from "mongodb";

let db;

export async function connectToMongo() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017'; //'localhost' when running locally, 'mongo' when using docker
    const client = new MongoClient(uri);

    try {
        await client.connect();
        db = client.db('documentsDb'); // Name the database
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export function getDb() {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
}
