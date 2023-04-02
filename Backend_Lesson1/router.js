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

  app.post("/users", async (req, res) => {
    const lock = req.body.auth;
    User.find(function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });

  app.post("/userlock", async (req, res) => {
    User.updateOne(
      { username: req.body.username },
      { auth: "" },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send(req.body.username + " is locked!");
      }
    );
  });

  app.post("/login", async (req, res) => {
    User.findOne(
      { username: req.body.username, auth: req.body.auth },
      function (err, data) {
        if (err) return res.status("500").send(err.message);
        if (!data) return res.status("400").send("Invalid Security Code");
        User.updateOne(
          { username: req.body.username },
          { status: "active" },
          function (err, data) {
            if (err) return res.status("500").send(err.message);

            return res.status("200").send({
              status: "Success",
              token: generateAccessToken({ username: req.body.username }),
            });
          }
        );
      }
    );
  });

  app.post("/register", async (req, res) => {
    const authCode = AuthCode();

    User.findOne({ username: req.body.username }, function (err, data) {
      if (err) return res.status("500").send(err.message);
      if (data && data._id)
        return res.status("400").send("Username is already exist!");

      const user = new User({ ...req.body, ...{ auth: authCode } });
      user.save(function (err) {
        if (err) return res.status("500").send(err.message);
        return res.status("200").send({
          message: "Success",
          data: {
            userId: new Date(user.createdAt).getTime().toString(),
            _id: user._id,
          },
        });
      });
    });
  });

  app.post("/filedelete", async (req, res) => {
    File.deleteOne({ _id: req.body.id }, function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(req.body.username + " is locked!");
    });
  });

  app.post("/fileInfoshare", async (req, res) => {
    try {
      const data = await File.aggregate().lookup({
        from: "tempfiles",
        as: "files",
        let: { file: { $toObjectId: "$file" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$file"] } } },
          { $project: { originalname: 1, mimetype: 1, size: 1 } },
        ],
      });

      return res.status("200").send(data);
    } catch (error) {
      return res.status("500").send(err.message);
    }
  });

  app.post("/files/dep", async (req, res) => {
    const _id = req.body._id;
    TempFile.findOne({ _id }, function (err, data) {
      if (err) return res.status("500").send(err.message || err);
      if (!data) return res.status("400").send("Bad request");

      const encrypt = encryptText(_id + "devicex", JSON.stringify(data));
      return res
        .status("200")
        .send({ file: encrypt, message: "Success", path: data.path });
    });
  });

  app.post("/fileshare", async (req, res) => {
    const path = req.body.path;
    var readStream = fs.createReadStream(path);

    TempFile.findOne({ path }, function (err, data) {
      console.log(path, data);
      res.writeHead(200, {
        "Content-Type": data.mimetype,
        "Content-Length": data.size,
      });

      readStream.pipe(res);
    });
  });

  app.post("/upload", async (req, res) => {
    var upload = multer({ storage: storage }).single("avatar");
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      } else if (!req.file) {
        return res.send("Please select an file to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      fileSplit(req.file.path, (response) => {
        const tempFile = new TempFile({ ...req.file, ...response });
        tempFile.save(function (err, doc) {
          if (err) return res.status("500").send(err.message || err);
          return res.status("200").send({ id: doc._id });
        });
      });
    });
  });

  app.post("/file", async (req, res) => {
    const file = new File(req.body);
    file.save(function (err) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(file);
    });
  });

  app.delete("/schedule", async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.body.id);
    Schedule.deleteOne({ _id }, function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send("Successfuly deleted!");
    });
  });

  app.post("/schedules", async (req, res) => {
    Schedule.find(function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });

  app.post("/schedules/user", async (req, res) => {
    const user = req.body.user;
    const date = req.body.date;
    try {
      const data = await Schedule.aggregate()
        .match({ $expr: { $eq: ["$date", date] } })
        .lookup({
          from: "records",
          as: "records",
          let: {
            user: { $toObjectId: user },
            schedule: "$_id",
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$user"] } } },
            { $match: { $expr: { $eq: ["$schedule", "$$schedule"] } } },
            { $project: { status: 1 } },
          ],
        });
      return res.status("200").send(data);
    } catch (error) {
      return res.status("500").send(error.message || error);
    }
    // Schedule.find(function (err, data) {
    //   if (err) return res.status("500").send(err.message);
    //   return res.status("200").send(data);
    // });
  });

  app.post("/schedule", async (req, res) => {
    const schedule = new Schedule(req.body);
    schedule.save(function (err) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(schedule);
    });
  });

  app.get("/records", async (req, res) => {
    Record.find(function (err, data) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(data);
    });
  });

  app.post("/record/user", async (req, res) => {
    const user = req.body.user;
    const date = req.body.date;
    try {
      const data = await Record.aggregate()
        .match({
          $expr: { $eq: ["$user", { $toObjectId: user }] },
        })
        .match({
          $expr: { $eq: ["$date", date] },
        })
        .lookup({
          from: "schedules",
          as: "schedules",
          let: {
            schedule: { $toObjectId: "$schedule" },
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$schedule"] } } },
            { $project: { date: 1, time: 1, name: 1 } },
          ],
        });
      return res.status("200").send(data);
    } catch (error) {
      return res.status("500").send(error.message || error);
    }
  });

  app.post("/record", async (req, res) => {
    const record = new Record({
      ...req.body,
      ...{
        schedule: mongoose.Types.ObjectId(req.body.schedule),
        user: mongoose.Types.ObjectId(req.body.user),
      },
    });
    record.save(function (err) {
      if (err) return res.status("500").send(err.message || err);
      return res.status("200").send(record);
    });
  });

  app.post("/securities", async (req, res) => {
    try {
      const data = await Security.aggregate().lookup({
        from: "users",
        as: "users",
        let: {
          user: { $toObjectId: "$user" },
        },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$user"] } } },
          { $project: { name: 1, username: 1, createdAt: 1 } },
        ],
      });
      return res.status("200").send(data);
    } catch (error) {
      return res.status("500").send(error.message || error);
    }
  });

  app.post("/security", async (req, res) => {
    // const security = new Security(req.body);
    Security.insertMany(req.body, function (err, logs) {
      if (err) return res.status("500").send(err.message);
      return res.status("200").send(logs);
    });
  });

  app.get("/image/url", async (req, res) => {
    try {
      console.warn("req.query", req.query);
      // const { key } = req.query;
      const response = await uploadPublicFile(req.query);
      return res.status(200).json({
        message: "Success",
        res: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        status: false,
      });
    }
  });

  // app.put("", async (req, res) => {

  // })
};

module.exports = { routes };
