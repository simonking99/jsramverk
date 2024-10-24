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
import { createServer } from 'http'; // Importera http för att skapa en HTTP-server
import { Server } from 'socket.io'; // Importera socket.io

const app = express();
const port = process.env.PORT || 3001;

// Skapa HTTP-server för socket.io
const httpServer = createServer(app);

// Skapa en ny instans av socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Tillåt anslutning från frontend
        methods: ["GET", "POST"],
        credentials: true // Säkerställ att credentials (cookies, tokens) skickas korrekt
    },
    transports: ['websocket'], // Tvinga endast WebSocket-transport
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

connectToMongo().catch(console.error);

// Hantera socket.io anslutning
io.on('connection', (socket) => {
    console.log('En användare anslöt:', socket.id);

    socket.on('create', (documentId) => {
        console.log(`Användaren gick med i dokumentrummet: ${documentId}`);
        socket.join(documentId);
    });

    socket.on('doc', (data) => {
        const { _id, title, html } = data;
        console.log(`Mottog uppdatering för dokument: ${_id}, sänder ändringar.`);
        io.to(_id).emit('doc', { _id, title, html });
    });

    socket.on('disconnect', () => {
        console.log('Användaren kopplade från:', socket.id);
    });

    socket.on('error', (err) => {
        console.log('Socket-fel:', err);
    });
});

// Våra routes
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
    res.json({ success: true, token });
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
        res.status(500).json({ success: false, message: 'Fel vid skickande av inbjudan' });
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

// Starta servern och lyssna på porten
httpServer.listen(port, () => {
    console.log(`Appen lyssnar på port ${port}`);
});
