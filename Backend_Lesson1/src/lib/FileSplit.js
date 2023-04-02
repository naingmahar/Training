const splitFile = require("split-file");
var fs = require("fs");
var Base64 = require("js-base64");
const { RandomKey } = require("./KeyGenerate");
const S3Upload = require("./S3Upload");
const { encryptText } = require("./encrypt");
const fileWriter = (input, serial) => {
  const name = RandomKey(16);
  fs.writeFileSync(`output/${name}.bin`, input);
  return {
    name,
    path: `output/${name}.bin`,
    serial,
    size: String(input).length,
  };
};

function convertDataURIToBinary(dataURI) {
  var bin = Base64.atob(dataURI);
  // Your code to handle binary data
  fs.writeFile("final/result_binary.pdf", bin, "binary", (error) => {
    if (error) {
      throw error;
    } else {
      console.log("binary saved!");
    }
  });
}

const fileMerge = (
  props = [
    {
      name: "",
      path: "",
      serial: 0,
      size: 0,
    },
  ]
) => {
  let data = "";
  props.map((row) => {
    const file = fs.readFileSync(row.path);
    data += file;
  });
  convertDataURIToBinary(data);
};

module.exports = {
  fileSplit: (path, cb) => {
    var input = fs.readFileSync(path).toString("base64");
    var size = input.length;
    var maxFileSize = 3145728; //3.1MB
    // var maxFileSize = 1048576; //1MB
    const splitLength = Math.ceil(size / maxFileSize);
    let filesInfo = [];
    for (let i = 0; i < splitLength; i++) {
      const start = maxFileSize * i;
      const end = maxFileSize * (i + 1) > size ? size : maxFileSize * (i + 1);
      const payload = input.slice(start, end);
      //   const info = fileWriter(payload, i);
      const key = RandomKey(8);
      filesInfo.push({ key, serial: i });
      S3Upload.S3Upload(payload, key, (info) => {});
    }

    // fileMerge(filesInfo);
    // convertDataURIToBinary(input);
    fs.unlinkSync(path);
    return cb({
      path,
      sharedSecret: encryptText(path, JSON.stringify(filesInfo)),
      initializationVector: RandomKey(16),
    });
  },
};
