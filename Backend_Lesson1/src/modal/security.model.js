const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  date: "number",
  action: "string",
  details: "string",
});
const SECURITY = mongoose.model("Security", schema);

module.exports = SECURITY;
