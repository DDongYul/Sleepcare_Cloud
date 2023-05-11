const express = require('express');
const router = express.Router();

const controller = require('./controller.js');

router.get('/', controller.index);
router.get('/authorize', controller.authorize);
router.get('/callback', controller.callback);
router.get('/user/:id', controller.getUser);
router.post('/user/:id', controller.postUser);
router.get('/user/:id/sleep',controller.getBestSleep);

module.exports = router;