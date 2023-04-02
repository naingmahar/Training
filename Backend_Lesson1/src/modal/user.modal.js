const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: "string",
    userId: "Number",
    name: "string",
    age: "string",
    phone: "string",
    gender: "string",
    passcode: "string",
    auth: "string",
    batch: "string",
    status: { type: "string", default: "pending" },
  },
  { timestamps: true }
);

const USER = mongoose.model("User", schema);

module.exports = USER;
