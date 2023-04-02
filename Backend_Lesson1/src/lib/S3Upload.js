var fs = require("fs");
const { config, S3 } = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  S3Upload: (fileStream, key, cb) => {
    const s3 = new S3();
    // var fileStream = fs.createReadStream(req.body.path);
    // const key =
    //   new Date().getMilliseconds().toString() +
    //   Math.round(Math.random() * 1000000).toString();

    // fileStream.on("error", function (err) {
    //   console.log("File Error", err);
    // });

    const uploadParams = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: key,
      Body: fileStream,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        throw new Error(err);
      }
      if (data) {
        return cb(data);
      }
    });
  },
  uploadPublicFile: async (obj) => {
    const s3 = new S3();
    const key =
      new Date().getMilliseconds().toString() +
      Math.round(Math.random() * 1000000).toString();

    const type = obj.type ? obj.type.split("/")[1] : "jpg";
    const keyString = obj.key ? obj.key : key;

    let confirmKey = `${obj.path}/${keyString}.${type}`;

    let params = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: confirmKey,
      Expires: 60 * 500,
      ContentType: obj.type ? obj.type : "image/jpg",
    };

    try {
      const url = await new Promise((resolve, reject) => {
        s3.getSignedUrl("putObject", params, (err, url) => {
          err ? reject(err) : resolve(url);
        });
      });
      //   console.log(url);

      return { url, key: confirmKey };
    } catch (err) {
      if (err) {
        // console.log(err);
        return Promise.reject(err);
      }
    }
  },
};
