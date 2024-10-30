import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connectToMongo, getDb } from './data/db/database.mjs';
import documents from './src/doc/docs.mjs';
import authenticate from './middleware/authenticate.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { graphqlHTTP } from 'express-graphql';
import { schema, root } from './graphql/docsgraph.js';

const app = express();
const port = process.env.PORT || 3001;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

connectToMongo().catch(console.error);
console.log("Loaded SendGrid API Key:", process.env.SENDGRID_API_KEY ? "Yes" : "No");

const visual = true;

// Använd GraphQL
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: visual,
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket'],
});

// Hantera socket.io anslutning
io.on('connection', (socket) => {
    console.log('En användare anslöt:', socket.id);

    socket.on('create', (documentId) => {
        console.log(`Användaren gick med i dokumentrummet: ${documentId}`);
        socket.join(documentId);
        
        const clientsInRoom = io.sockets.adapter.rooms.get(documentId)?.size || 0;
        console.log(`Antal användare i rummet ${documentId}: ${clientsInRoom}`);
    });

    socket.on('doc', (data) => {
        const { _id, title, html } = data;
        socket.to(_id).emit('doc', { _id, title, html });
        console.log(`Sent document update to room ${_id}`);
    });

    socket.on('newComment', (commentData) => {
        const { documentId, line, text, user } = commentData;
        console.log(`Received new comment for document ${documentId}: "${text}" on line ${line} by ${user}`);
        socket.to(documentId).emit('newComment', commentData);
    });

    socket.on('disconnect', () => {
        console.log('Användaren kopplade från:', socket.id);
    });

    socket.on('error', (err) => {
        console.log('Socket-fel:', err);
    });
});

// REST API endpoints
app.get('/documents', authenticate, async (req, res) => {
    const userId = req.user.id;
    console.log(req.user);

    try {
        const userDocs = await documents.getAllByUser(userId);
        const sharedDocs = await documents.getAllShared(userId);
        const allDocs = [...userDocs, ...sharedDocs];
        res.json(allDocs);
    } catch (error) {
        console.error('Fel vid hämtning av dokument:', error);
        res.status(500).json({ message: 'Fel vid hämtning av dokument' });
    }
});

app.get('/documents', authenticate, async (req, res) => {
    const userId = req.user.id;
    console.log(req.user);

    try {
        const userDocs = await documents.getAllByUser(userId);
        const sharedDocs = await documents.getAllShared(userId);
        const allDocs = [...userDocs, ...sharedDocs];
        res.json(allDocs);
    } catch (error) {
        console.error('Fel vid hämtning av dokument:', error);
        res.status(500).json({ message: 'Fel vid hämtning av dokument' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const db = getDb();
    const user = await db.collection('users').findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Felaktigt användarnamn eller lösenord' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Felaktigt användarnamn eller lösenord' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, userId: user._id });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Användarnamn och lösenord är obligatoriska.' });
    }

    const db = getDb();
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: 'Användarnamn är redan upptaget.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'Användare registrerad.' });
});

app.post('/addone', authenticate, async (req, res) => {
    const userId = req.user.id;
    const documentData = { ...req.body, userId };
    const result = await documents.addOne(documentData);
    res.json({ success: true, result });
});

app.post('/invite', authenticate, async (req, res) => {
    const { recipientEmail, documentId } = req.body;
    const senderEmail = "tiqmax@outlook.com";

    const msg = {
        to: recipientEmail,
        from: senderEmail,
        subject: 'Inbjudan till att redigera dokument',
        text: `Hej,\n\nDu har blivit inbjuden att redigera ett dokument.\n\nKopiera följande dokument-ID för att få åtkomst till det: ${documentId}\n\nVänligen registrera dig och logga in för att använda dokument-ID:t.\n\nHälsningar,\nDitt team.`,
        html: `<p>Hej,</p>
               <p>Du har blivit inbjuden att redigera ett dokument.</p>
               <p>Kopiera följande dokument-ID för att få åtkomst till det: <strong>${documentId}</strong></p>
               <p>Vänligen <a href="http://localhost:3000/register">registrera dig</a> och logga in för att använda dokument-ID:t.</p>
               <p>Hälsningar,<br>Ditt team.</p>`,
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true, message: 'Inbjudan skickad' });
    } catch (error) {
        console.error('Fel vid skickande av inbjudan:', error);
        if (error.response) {
            console.error('SendGrid Response:', error.response.status, error.response.body);
        }
        res.status(500).json({ success: false, message: 'Fel vid skickande av inbjudan', error: error.response?.body });
    }
});

app.post('/share', authenticate, async (req, res) => {
    const { documentId, username } = req.body;

    try {
        const db = getDb();

        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Användaren hittades inte' });
        }

        const result = await documents.share(documentId, user._id);

        res.json({ success: true, message: 'Dokumentet har delats', result });
    } catch (error) {
        console.error('Fel vid delning av dokument:', error);
        res.status(500).json({ message: 'Fel vid delning av dokumentet' });
    }
});

app.get('/document/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const doc = await documents.getOne(id);

    res.json(doc);
});

app.put('/updateone/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const result = await documents.updateOne(id, req.body);
    res.json({ success: true, result });
});

app.delete('/deleteAll', authenticate, async (req, res) => {
    const userId = req.user.id;
    const result = await documents.deleteAllByUser(userId);
    res.json({ success: true, deletedCount: result.deletedCount });
});

httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});