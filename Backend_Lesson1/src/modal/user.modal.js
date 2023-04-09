const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: "string",
    name: "string",
    age: "string",
    phone: "string",
    gender: "string",
    password: "string",
    role: { type: "string", default: "user" }, //user and admin
    image: "string",
  },
  { timestamps: true }
);

const USER = mongoose.model("User", schema);

module.exports = USER;
