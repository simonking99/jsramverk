import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://sibo18:${process.env.DB_PASS}@cluster0.xuelz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
