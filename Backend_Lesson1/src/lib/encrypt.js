var CryptoJS = require("crypto-js");

module.exports = {
  encryptText: (key, payload) => {
    const authCode = CryptoJS.AES.encrypt(payload, key).toString();
    return authCode;
  },
};
