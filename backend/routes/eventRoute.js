const express = require('express');
const {eventInfo,getEvent,playerEvent,teamEvent,eventList,eventUpdate,delEvent} = require('../controllers/eventController');
const router = express.Router();

router.route('/').post(eventInfo);
router.route('/list').get(eventList);

router.route('/:id').get(getEvent);
router.route('/players/:id').get(playerEvent);
router.route('/update/:id').put(eventUpdate);
router.route('/del/:id').delete(delEvent);
router.route('/teams/:id').get(teamEvent);





module.exports =router;