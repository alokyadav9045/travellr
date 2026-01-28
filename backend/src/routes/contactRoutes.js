const express = require('express');
const { submitContact, subscribeNewsletter } = require('../controllers/contactController');

const router = express.Router();

router.post('/', submitContact);
router.post('/newsletter', subscribeNewsletter);

module.exports = router;
