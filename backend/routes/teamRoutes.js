const express = require('express');
const {teamInfo,teamLogin} = require('../controllers/teamRegisterationController');
const router = express.Router();

router.route('/registeration').post(teamInfo);
router.route('/login').post(teamInfo);
router.route('/').get(teamInfo);



module.exports =router;