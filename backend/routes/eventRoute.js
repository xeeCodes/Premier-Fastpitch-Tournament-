const express = require('express');
const {eventInfo,getEvent} = require('../controllers/eventController');
const router = express.Router();

router.route('/').post(eventInfo);
router.route('/:id').get(getEvent);



module.exports =router;