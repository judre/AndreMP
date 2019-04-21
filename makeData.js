var connect = require("./dbConnect.js");
connect(require("./settings").DEV_DB_URI);

var User = require("./models/User.js");
var LocationBlog = require("./models/LocationBlog.js");
var Position = require("./models/Position.js");
var Area = require('./models/Area.js');
var userFacade = require("./facades/userFacade.js")

function positionCreator(lon, lat, userId, dateInFuture) {
  var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
  if (dateInFuture) {
    posDetail.created = "2022-09-25T20:40:21.899Z"
  }
  return posDetail;
}

async function makeData() {
  console.log("Making users")
  try {
    var userInfos = [
      { firstName: "a", lastName: "a", userName: "a", password: "a", email: "a@a.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }] },
      { firstName: "b", lastName: "b", userName: "b", password: "a", email: "b@b.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }] },
      { firstName: "c", lastName: "c", userName: "c", password: "c", email: "c@c.dk", job: [{ type: "t1", company: "c1", companyUrl: "url" }] }
    ];
    await User.deleteMany({});
    await Position.deleteMany({});
    await LocationBlog.deleteMany({});
    await Area.deleteMany({});
    //This will not activate the "save" midleware
    var users = await User.insertMany(userInfos);
    console.log(`${users.length} Users was created`);

    //This will activate the "save" midleware
    var u = new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "ckw", password: "c", email: "kw@c.dk" });
    await u.save();
    var positions = [positionCreator(10, 11, users[0]._id), positionCreator(11, 12, users[1]._id, true),
    ]
    await Position.insertMany(positions)
    var blogs = [{ info: "Cool Place", pos: { longitude: 26, latitude: 57 }, author: users[0]._id },]
    var blogs = await LocationBlog.insertMany(blogs);

 
  } catch (err) {
    console.log(err);
  }
}
makeData();
