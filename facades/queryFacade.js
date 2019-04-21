
const User = require('../models/User');
const Position = require('../models/Position');
const Area = require('../models/Area');
const gju = require('geojson-utils');


async function findNearbyPlayers(lon, lat, dist) {
	return Position.find({
		loc: {
			$near: {
				$geometry: { type: 'Point', coordinates: [lon, lat] },
				$minDistance: 0.1,
				$maxDistance: dist
			}
		}
	})
		.populate('user', 'userName firstName') // you can add more variables if you like
		.select({ created: 0, __v: 0, _id: 0, 'loc.type': 0, 'user._id': 0 });
}


async function isUserinArea(areaName, username) {
	const area = await Area.findOne({ name: areaName });
	if (area === null) {
		throw new Error("Area Not Found")
	}
	const user_id = await User.findOne({ userName: username }).select({ _id: 1 });
	if (user_id !== null) {
		const userPos = await Position.findOne({
			user: user_id,
			loc: {
				$geoWithin: {
					$geometry: area
				}
			}
		})
			.catch(() => {
				throw new Error(`${username} doesn't have a Location`);
			});
		var status = false;
		var msg = "Point was NOT inside tested polygon"
		if (userPos !== null) {
			status = true;
			msg = "Point was inside the tested polygon"
		}
		return {status, msg};


	} else {
		throw new Error(`User: ${username} doesn't Exist`);
	}
}

async function getDistanceToUser(lon, lat, username) {
	const user_id = await User.findOne({ userName: username }).select({ _id: 1 });
	if (user_id !== null) {
		return (userPos = await Position.findOne({ user: user_id })
			.catch(() => {
				throw new Error(`${username} doesn't have a Location`);
			})
			.then(async (data) => {
				if (data === null) {
					throw new Error(`${username} doesn't have a Location`);
				} else {
					const point = { type: 'Point', coordinates: [lon, lat] };
					const distance = await gju.pointDistance(point, data.loc); // finds distance in meters between Point and User
					return { username: username, distance };
				}
			}));
	} else {
		throw new Error(`User: ${username} doesn't Exist`);
	}
}

module.exports = {
	getDistanceToUser,
	findNearbyPlayers,
	isUserinArea
};
