var express = require('express');
var router = express.Router();
var queryFacade = require('../facades/queryFacade');
var mongoose = require('mongoose');


/* GET distance to user from username and coordinates */
router.get('/distanceToUser/:lon/:lat/:username', async function(req, res, next) {
	var { lon, lat, username } = req.params;
	var obj = await queryFacade.getDistanceToUser(lon, lat, username).catch((err) => {
		res.status(404).json({ msg: err.message });
	});
	if (obj !== undefined) {
		res.status(200).json({ distance: obj.distance, to: obj.username });
	}
});

/* GET is in user area from username and areaname */
router.get('/userInArea/:areaname/:username', async function(req, res, next) {
	var { areaname, username } = req.params;
	var obj = await queryFacade.isUserinArea(areaname, username).catch((err) => {
		res.status(404).json({ msg: err.message });
	});
	if (obj !== undefined) {
		res.status(200).json({ status: obj.status, msg: obj.msg });
	}
});


router.get('/error', function(req, res, next) {
	// for demonstration
	if (true) {
		//create error object
		var err = new Error('UPPPPPS');
		// setting a new variable in err
		err.isJson = true;
		// can be thrown with --> throw err
		return next(err);
	}
});

module.exports = router;
