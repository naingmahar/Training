const mongoose = require("mongoose");
const moment = require("moment");
const schema = new mongoose.Schema({
  schedule: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
  status: mongoose.Schema.Types.Boolean,
  feedback: "string",
  date: { type: "string" },
  time: { type: "string" },
});
const RECORD = mongoose.model("Record", schema);

module.exports = RECORD;
