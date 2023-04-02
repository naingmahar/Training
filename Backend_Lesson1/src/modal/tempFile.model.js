const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  path: "string",
  sharedSecret: mongoose.Schema.Types.Mixed,
  initializationVector: mongoose.Schema.Types.Mixed,
  originalname: "string",
  mimetype: "string",
  size: "Number",
});
const TEMPFILE = mongoose.model("TempFile", schema);

module.exports = TEMPFILE;
