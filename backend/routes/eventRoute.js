const express = require('express');
const {eventInfo} = require('../controllers/eventController');
const router = express.Router();

router.route('/').post(eventInfo)

module.exports =router;