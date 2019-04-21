const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true
  },
  name: { type: String, unique: true, required: true }
});

polygonSchema.index({ loc: "2dsphere" },{ "background": true });

Polygon = mongoose.model("Area", polygonSchema);
module.exports = Polygon;