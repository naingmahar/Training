const express = require("express");
const port = 3000;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { config, S3 } = require("aws-sdk");
const { routes } = require("./router");
const dotenv = require("dotenv");
dotenv.config();
var { authenticateToken } = require("./src/middleware/jwt");

var log = require("noogger");
var colors = require("colors");
var fs = require("fs");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

app.use(cors());
app.use(bodyParser.json());

app.get("/s3", (req, res) => {
  const s3 = new S3();

  // Call S3 to list the buckets
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Buckets);
    }
  });

  res.send(data.Buckets);
});

app.post("/s3/upload", (req, res) => {
  const s3 = new S3();
  var fileStream = fs.createReadStream(req.body.path);
  const key =
    new Date().getMilliseconds().toString() +
    Math.round(Math.random() * 1000000).toString();

  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });

  const uploadParams = {
    Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
    Key: key,
    Expires: 60 * 1440,
    Body: fileStream,
  };

  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.send(err);
    }
    if (data) {
      return res.send(data);
    }

    return res.send("Empty");
  });
});

// app.use(authenticateToken);
routes(app);

// const logo = `
//   _   _   _   _   _   _   _   _   _   _   _   _
//  / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\
// ( F | E | D | E | R | A | L |   | A | R | M | Y )
//  \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/
// `;

const logo = `
╔═╗┌─┐┌┬┐┌─┐┬─┐┌─┐┬    ┌─┐┬─┐┌┬┐┬ ┬
╠╣ ├┤  ││├┤ ├┬┘├─┤│    ├─┤├┬┘│││└┬┘
╚  └─┘─┴┘└─┘┴└─┴ ┴┴─┘  ┴ ┴┴└─┴ ┴ ┴ 
`;

app.listen(port, () => {
  console.log(logo.america);
  log.info("Status      : " + colors.green("Start"));
  log.info("Name        : " + colors.green("Federal Army"));
  log.info(`Version     : ${colors.green(process.env.VERSION || "1.0.0.1")}`);
  log.info("Port Number : " + colors.green(port));
});
