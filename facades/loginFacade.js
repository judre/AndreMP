const Position = require('../models/Position');
const User = require('../models/User');
const gju = require('geojson-utils');
const colors = require('colors');
const queryFacade = require("./queryFacade");

// needs refactoring
async function login(username, password, lon, lat, radius) {
	var position = {};
	var user = await User.findOne({ userName: username, password }).select({ _id: 1 }).catch((err) => {
		throw new Error('err has occured');
	});
	if (user !== null) {
		var dbPosition = await Position.findOne({ user: user._id }).catch((err) => {
			throw Error(err);
		});
		if (dbPosition === null) {
			var position = new Position({
				user: user._id,
				loc: { type: 'Point', coordinates: [ lon, lat ] }
			});
			await Position.findOneAndUpdate({ user: user._id }, position, {
				upsert: true,
				new: true
			});
		} else {
			await Position.findOneAndUpdate(
				{ user: user._id },
				{ loc: { type: 'Point', coordinates: [ lon, lat ] } },
				{
					new: true
				}
			).catch((err) => {
				console.log(colors.red(err.errmsg));
			});
		}

		var friends = await queryFacade.findNearbyPlayers(lon, lat, radius, { user: 1, _id: 0 }).catch((err) => {
			console.log(colors.red(err.errmsg));
		});

		return friends;
	}
	return null;
}

module.exports = {
	login
};
