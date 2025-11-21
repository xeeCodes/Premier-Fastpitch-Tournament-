const express = require('express');
const {teamInfo} = require('../controllers/teamRegisterationController');
const router = express.Router();

router.route('/team').post(teamInfo);

module.exports =router;