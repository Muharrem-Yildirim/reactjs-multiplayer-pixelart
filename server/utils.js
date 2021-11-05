function isTestVersion() {
  return process.env.IS_TEST_VERSION == "true"
    ? true
    : typeof process.env.IS_TEST_VERSION === "undefined"
    ? true
    : false;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

global.Buffer = global.Buffer || require("buffer").Buffer;

if (typeof btoa === "undefined") {
  global.btoa = function (str) {
    return new Buffer.from(str, "binary").toString("base64");
  };
}

if (typeof atob === "undefined") {
  global.atob = function (b64Encoded) {
    return new Buffer.from(b64Encoded, "base64").toString("binary");
  };
}

module.exports = { isTestVersion, getRandomArbitrary };
