const express = require('express');

const router = express.Router();
const { index } = require('./controllers');
const { test } = require('./controllers');

router.get('/', index);
router.get('/test', test);

module.exports = router;
