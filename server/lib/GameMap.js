const ArrayKeyedMap = require("array-keyed-map"),
  Pixel = require("./Pixel"),
  utils = require("../utils"),
  MapModel = require("../model/MapModel"),
  moment = require("moment"),
  mongoose = require("mongoose");

const PIXEL_SIZE = Number(process.env.PIXEL_SIZE) || 10;

class GameMap {
  constructor(attachedRoom, width = 500, height = 500) {
    this.attachedRoom = attachedRoom;
    this.width = width;
    this.height = height;

    this.map = new ArrayKeyedMap();

    if (utils.isTestVersion()) {
      this.printNextReset();

      setInterval(this.reset, 60 * 1000 * 10);
    }

    setInterval(this.saveMap, 60 * 1000);
  }

  loadMap = () => {
    MapModel.findOne(
      {
        room_id: this.getRoom().getRoomId(),
      },

      (err, map) => {
        if (err) console.log(err);
        this.map = new ArrayKeyedMap([...JSON.parse(map.data)]);
        this.setSize(map.size.width, map.size.height);
      }
    );
  };

  saveMap = () => {
    if (mongoose.connection.readyState !== 1) return;

    let query = {
        room_id: this.getRoom().getRoomId(),
      },
      update = {
        data: JSON.stringify([...this.getMap().entries()]),
        size: {
          width: this.getSize().width,
          height: this.getSize().height,
        },
      },
      options = { upsert: true, new: true };

    MapModel.findOneAndUpdate(query, update, options, function (err) {
      if (err) console.log(err);
    });
  };

  printNextReset = () => {
    let nexReset = moment(moment().valueOf() + 60 * 1000 * 10);

    console.log(
      "[RESET] Room: " +
        this.getRoom().getRoomId() +
        " Reset: " +
        moment().format("HH:mm") +
        " > " +
        nexReset.format("HH:mm")
    );
  };

  reset = () => {
    this.printNextReset();

    this.map = new ArrayKeyedMap();

    for (let y = PIXEL_SIZE; y < this.height - PIXEL_SIZE; y += PIXEL_SIZE) {
      for (let x = PIXEL_SIZE; x < this.width - PIXEL_SIZE; x += PIXEL_SIZE) {
        let _x = x - (x % PIXEL_SIZE);
        let _y = y - (y % PIXEL_SIZE);

        this.paint(_x, _y, "white");
      }
    }

    this.syncMapToAll();
  };

  getRoom = () => this.attachedRoom;

  syncMapToAll = () =>
    global.SOCKET.in(this.getRoom().roomName).emit("loadMap", [
      ...this.getMap().entries(),
    ]);

  syncMapToSocket = (socket) =>
    socket.emit("loadMap", [...this.getMap().entries()]);

  getMap = () => this.map;

  setSize = (width = 500, height = 500) => {
    this.width = Number(width - (width % PIXEL_SIZE));
    this.height = Number(height - (height % PIXEL_SIZE));

    if (this.width < 50) this.width = 50;
    if (this.height < 50) this.height = 50;
    if (this.width > 1000) this.width = 1000;
    if (this.height > 1000) this.height = 1000;
  };

  getSize = () => {
    return { width: this.width, height: this.height };
  };

  paint = (x, y, color, room) => {
    let coord = [x, y];

    // console.log(room);

    if (this.map.has(coord)) {
      let curPixel = this.map.get(coord).toString();

      if (curPixel !== color) {
        global.SOCKET.in(room).emit("paint", { x, y, color });

        if (color === "white" || color.toLowerCase() === "#ffffff") {
          this.map.delete(coord);
        } else {
          this.map.set(coord, new Pixel(color));
        }
      }
    } else {
      if (color === "white" || color.toLowerCase() === "#ffffff") return;

      global.SOCKET.in(room).emit("paint", { x, y, color });
      this.map.set(coord, new Pixel(color));
    }
  };
}

module.exports = GameMap;
