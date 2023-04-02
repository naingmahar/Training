const mongoose = require("mongoose");
const moment = require("moment");
const schema = new mongoose.Schema({
  date: "string",
  name: "string",
  time: "string",
  description: "string",
  batch: "string",
  imageUrl: "string",
});
const SCHEDULE = mongoose.model("Schedule", schema);

module.exports = SCHEDULE;
