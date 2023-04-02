const mongoose = require("mongoose");
const TEMPFILE = require("./tempFile.model");

const schema = new mongoose.Schema(
  {
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tempfiles",
    },
    name: "string",
    url: "string",
    description: "string",
  },
  { timestamps: true }
);
const FILE = mongoose.model("File", schema);

module.exports = FILE;
