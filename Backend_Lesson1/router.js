var { storage } = require("./server");
// const express = require("express");
// const app = express();
const fs = require("fs");
var User = require("./src/modal/user.modal");
var File = require("./src/modal/file.modal");
var Record = require("./src/modal/record.model");
var Schedule = require("./src/modal/schedule.model");
var TempFile = require("./src/modal/tempFile.model");
var Security = require("./src/modal/security.model");
var multer = require("multer");
const path = require("path");
var { AuthCode } = require("./src/lib/KeyGenerate");
var { EncryptFile } = require("./src/lib/FileEncrypt");
var { fileSplit } = require("./src/lib/FileSplit");
var { generateAccessToken } = require("./src/middleware/jwt");
const mongoose = require("mongoose");
const { encryptText } = require("./src/lib/encrypt");
const { uploadPublicFile } = require("./src/lib/S3Upload");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let routes = (app) => {
  app.get("/", async (req, res) => {
    res.send("Successful response." + (await mongoose.connection.readyState));
  });

  app.get("/users", async (req, res) => {
    const lock = req.body.auth;
    User.find(function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });


  app.post("/permission", async (req, res) => {
    User.updateOne(
      { _id: req.body._id },
      { role: req.body.role },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send(req.body.username + " is locked!");
      }
    );
  });

  app.post("/login", async (req, res) => {
    User.findOne(
      { username: req.body.username, password: req.body.password },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        if (!data) return res.status("400").send({error:"Invalid Security Code",message:"Fail"});
        return res.status("200").send({
          status: "Success",
          token: generateAccessToken({ username: req.body.username }),
        });
      }
    );
  });

  app.post("/register", async (req, res) => {
    User.findOne({ username: req.body.username }, function (err, data) {
      if (err) return res.status("500").send(err.message);
      if (data && data._id)
        return res.status("400").send({error:"Username is already exist!"});

      const user = new User({ ...req.body });
      user.save(function (err) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send({
          message: "Success",
          data: {
            "role": user.role,
            "_id": user._id,
            "username": user.username,
            "name": user.name,
            "age": user.age,
            "phone": user.phone,
            "gender": user.gender,
            "image": user.image,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
          },
        });
      });
    });
  });
};

module.exports = { routes };
