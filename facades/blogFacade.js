var mongoose = require("mongoose");
var LocationBlog = require("../models/LocationBlog");

function getAllLocationBlogs() {
    return LocationBlog.find({}).exec();
}


async function likeLocationBlog(blogid, userid) {
    return await LocationBlog.findOneAndUpdate({ _id: blogid }, {likedBy: [userid]}, {new: true}).exec();
}

function findById(id) {
    return LocationBlog.findById({ _id: id }).exec();
}

async function addLocationBlog(info, img, pos, author) {
    var locationBlog = new LocationBlog({info: info, img: img, pos: pos, author: author})
    await locationBlog.save();
    return locationBlog;
}
module.exports = {
    getAllLocationBlogs,
    addLocationBlog,
    likeLocationBlog,
    findById
}