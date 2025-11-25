const express = require('express');
const {playerInfo,playerLogin,delPlayer,allPlayers,singlePlayer,updatePlayer} = require('../controllers/playerRegisterationController');
const router = express.Router();

router.route('/registeration').post(playerInfo);
router.route('/login').post(playerLogin);
router.route('/list').get(allPlayers);
router.route('/:id').get(singlePlayer);
router.route('/:id').delete(delPlayer);

router.route('/update/:id').put(updatePlayer);




module.exports =router;