const express = require('express');
const docsController = require('../controllers/docsController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/add', authenticate, docsController.addDocument);
router.get('/', authenticate, docsController.getAllDocuments);

module.exports = router;
