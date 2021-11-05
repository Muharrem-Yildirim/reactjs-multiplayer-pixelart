const utils = require("./utils");

const origin = utils.isTestVersion()
  ? [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://78.184.180.133:3000",
    ]
  : [
      "http://reactjs-multiplayer-pixelart.herokuapp.com",
      "https://reactjs-multiplayer-pixelart.herokuapp.com",
    ];

module.exports = { origin };
