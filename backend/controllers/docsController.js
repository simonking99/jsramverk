const docsModel = require('../models/docsModel');

exports.addDocument = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; // Från JWT

    try {
        const result = await docsModel.addOne({ title, content, userId });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Misslyckades med att lägga till dokument' });
    }
};