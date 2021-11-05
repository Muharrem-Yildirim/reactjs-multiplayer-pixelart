const { v4: uuidv4 } = require("uuid");
const GameMap = require("./GameMap");

const PIXEL_SIZE = Number(process.env.PIXEL_SIZE) || 10;

class Room {
  constructor(roomName = uuidv4(), roomId = uuidv4()) {
    this.roomName = roomName;
    this.roomId = roomId;
    this.currentMap = new GameMap(this);

    // global.SOCKET
  }

  getRoomName = () => this.roomName;

  getRoomId = () => this.roomId;

  join = (socket) => {
    socket.room = this.getRoomId();
    socket.join(this.getRoomId());

    socket.on("paint", async (data) => {
      if (
        !(
          (
            data.hasOwnProperty("x") &&
            data.hasOwnProperty("y") &&
            data.hasOwnProperty("color")
          )
          // &&  data.hasOwnProperty("key")
        )
      ) {
        console.log("!defined_structure");
        return;
      }

      let { x, y, color, key } = data;

      if (x < PIXEL_SIZE) return;
      if (x > this.currentMap.getSize().width - PIXEL_SIZE * 2) return;
      if (y < PIXEL_SIZE) return;
      if (y > this.currentMap.getSize().height - PIXEL_SIZE * 2) return;

      x = x - (x % PIXEL_SIZE);
      y = y - (y % PIXEL_SIZE);

      this.currentMap.paint(x, y, color, socket.room);
    });

    // socket.on("requestClientCount", (response) => {
    //   response(1337);
    //   global.SOCKET.in(this.getRoomName()).emit(
    //     "clients",
    //     this.getUsers().size
    //   );
    // });

    socket.on("requestClientCount", (callback) => {
      callback(this.getUsers().size);
    });

    socket.emit("onJoinRoom", this.getRoomId());

    global.SOCKET.in(this.getRoomId()).emit("clients", this.getUsers().size);

    socket.on("disconnect", () => {
      console.log(this.getUsers().size);
      global.SOCKET.in(this.getRoomId()).emit("clients", this.getUsers().size);
    });
  };

  getCurrentMap = () => this.currentMap;

  getUsers = () =>
    global.SOCKET.sockets.adapter.rooms.get(this.getRoomId()) || new Set();
}

module.exports = Room;
