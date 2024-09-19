// app.mjs
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connectToMongo } from './data/db/database.mjs';
import documents from "./src/doc/docs.mjs";

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Connect to MongoDB
connectToMongo().catch(console.error);

// Return JSON instead of rendering views
app.get('/', async (req, res) => {
    const docs = await documents.getAll();
    res.json(docs);
});

app.post('/addone', async (req, res) => {
    const result = await documents.addOne(req.body);
    res.json({ success: true, result });
});

app.get('/document/:id', async (req, res) => {
    const id = req.params.id;
    const doc = await documents.getOne(id);
    res.json(doc);
});

app.put('/updateone/:id', async (req, res) => {
    const id = req.params.id;
    const result = await documents.updateOne(id, req.body);
    res.json({ success: true, result });
});

app.delete('/deleteAll', async (req, res) => {
    try {
        const result = await documents.deleteAll();
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting all documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
