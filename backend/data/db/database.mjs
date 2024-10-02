import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI || `mongodb+srv://tiqma:${process.env.DB_PASS}@jsramverk.c1isy.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

export function connectToMongo() {
  return client.connect()
    .then(() => {
      return client.db("admin").command({ ping: 1 });
    })
    .then(() => {
      console.log("Successfully connected to MongoDB!");
      db = client.db('documentsDb');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    });
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export async function connectToDbTest(uri) {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db('test');
}