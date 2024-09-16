import 'dotenv/config'

const port = process.env.PORT;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/addone", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/`);
});

app.get('/addoneform', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.get('/updateoneform/:id', async (req, res) => {
    const id = req.params.id;

    const doc = await documents.getOne(id);

    res.render('docupdate', {
        doc,
        id
    });
});

app.post('/updateone/:id', async (req, res) => {

    const id = req.params.id;
    const updatedData = req.body;

    await documents.updateOne(id, updatedData);

    res.redirect(`/`);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
