const express = require('express');
const {eventInfo,getEvent,playerEvent} = require('../controllers/eventController');
const router = express.Router();

router.route('/').post(eventInfo);
router.route('/:id').get(getEvent);
router.route('/player/:id').get(playerEvent);




module.exports =router;