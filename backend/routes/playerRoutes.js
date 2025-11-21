const express = require('express');
const {playerInfo} = require('../controllers/playerRegisterationController');
const router = express.Router();

router.route('/player').post(playerInfo)

module.exports =router;