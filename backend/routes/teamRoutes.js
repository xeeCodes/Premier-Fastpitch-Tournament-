const express = require('express');
const {teamInfo,teamLogin,delTeam,allTeams,singleTeam,updateTeam} = require('../controllers/teamRegisterationController');
const router = express.Router();

router.route('/registeration').post(teamInfo);
router.route('/login').post(teamLogin);
router.route('/').get(allTeams);
router.route('/:id').get(singleTeam);
router.route('/:id').delete(delTeam);
router.route('/update/:id').put(updateTeam);

module.exports = router;
