function makeid(length) {
  var result = [];
  var characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

module.exports = {
  AuthCode: () => {
    return makeid(6);
  },
  RandomKey: (length) => {
    return makeid(length);
  },
};
