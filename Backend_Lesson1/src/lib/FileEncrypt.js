var fs = require("fs");
var crypto = require("crypto");
var cryptoJs = require("crypto-js");

module.exports = {
  EncryptFile: (path, cb) => {
    // const sharedSecret = crypto.randomBytes(32).toString("base64");
    // const initializationVector = crypto.randomBytes(16).toString();
    // var input = fs.readFileSync(path).toString("base64");
    // const data = cryptoJs.AES.encrypt(input, sharedSecret, {
    //   iv: initializationVector,
    // }).toString();
    // fs.writeFile(path + ".enc", input, () => {
    //   cb({
    //     path: path + ".enc",
    //     sharedSecret,
    //     initializationVector,
    //   });
    // });
    // const sharedSecret = crypto.randomBytes(32).toString();
    // const initializationVector = crypto.randomBytes(16).toString();
    //   var cipher = cryptoJs.algo.AES.createEncryptor(
    //     sharedSecret,
    //     initializationVector
    //   );
    //   var input = fs.createReadStream(path);
    //   var output = fs.createWriteStream(path + ".enc");
    //   input.pipe(cipher).pipe(output);
    //   output.on("finish", function () {
    //     // console.log("Encrypted file written to disk!");
    //     fs.unlinkSync(path);
    //     cb({
    //       path: path + ".enc",
    //       sharedSecret,
    //       initializationVector,
    //     });
    //   });
  },
};
