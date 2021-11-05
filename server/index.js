const express = require("express"),
  path = require("path"),
  cors = require("cors"),
  socketIO = require("socket.io"),
  { v4: uuidv4 } = require("uuid"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");
require("dotenv").config();

const utils = require("./utils"),
  shared = require("./shared"),
  Room = require("./lib/Room"),
  apiRouter = require("./api/index"),
  Rooms = new Map(),
  PORT = process.env.PORT || 1337,
  MapModel = require("./model/MapModel");

global.ROOMS = Rooms;

async function main() {
  await mongoose
    .connect("mongodb://localhost:27017/multiplayer-pixelart")
    .then(loadRooms);
}

//#region STARTING MESSAGES
console.log("\x1b[32m", "=".repeat(75), "\x1b[0m", "");
console.log(" > Web server is starting...");
console.log(" ");
console.log(" Settings");
console.log("  > Test Mode: " + utils.isTestVersion());
console.log("  > Pixel Size: " + (Number(process.env.PIXEL_SIZE) || 10), "\n");
//#endregion

const server = express()
  .set("json spaces", 2)
  .use(bodyParser.json())
  .use(
    cors({
      origin: shared.origin,
    })
  )
  .use("/api", apiRouter)
  .get("/:roomId", async (req, res, next) => {
    const roomId = req.params.roomId;

    if (!Rooms.has(roomId)) {
      res.redirect("/");
      return;
    }

    res.sendFile("index.html", { root: path.join(__dirname, "build") });
  })
  .use(express.static(path.join("build")))

  .listen(PORT, () => {
    //#region STARTING MESSAGES
    console.log(
      ` > Web server listening on ${server.address().address}:${
        server.address().port
      }.`
    );

    console.log("\x1b[32m", "=".repeat(75), "\x1b[0m", "\n");
    //#endregion

    const io = socketIO(server, { cors: "*" });
    global.SOCKET = io;
    listenServer(io);
  });

function listenServer(io) {
  io.on("connection", (socket) => {
    const roomId = socket?.handshake?.query["room"]?.replace("/", "");

    if (Rooms.has(roomId)) {
      Rooms.get(roomId).join(socket);
    } else {
      if (typeof roomId !== "undefined" && roomId !== "") {
        socket.emit("roomError");
        socket.disconnect();
        return;
      }
    }

    socket.on("disconnect", () =>
      console.log("[DISCONNECT] User disconnected: ", socket.id)
    );
    console.log("[CONNECT] New user connected: ", socket.id);
  });
}

const loadRooms = () => {
  MapModel.find({}, function (err, map) {
    map.forEach((map) => {
      let newRoom = new Room(undefined, map.room_id);
      global.ROOMS.set(newRoom.roomId, newRoom);
      newRoom.getCurrentMap().setSize(map.size.width, map.size.height);
      newRoom.getCurrentMap().loadMap();
    });
  });
};

main().catch((err) => console.log(err));
