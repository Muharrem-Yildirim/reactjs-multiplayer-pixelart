const express = require("express"),
  router = express.Router(),
  validator = require("validator");

const utils = require("../utils"),
  Room = require("../lib/Room");

router
  .get("/get-environment-vars", (req, res) => {
    res.json({
      isTestVersion: utils.isTestVersion(),
      pixelSize: Number(process.env.PIXEL_SIZE) || 10,
      // canvasSize: CurrentMap.getSize(),
    });
  })

  .get("/rooms", async (req, res) => {
    let roomList = [];

    await Promise.all(
      Array.from(global.ROOMS.values()).map(async (room) => {
        roomList.push({
          id: room.getRoomId(),
          name: room.getRoomName(),
          users: [...room.getUsers()],
          userCount: room.getUsers().size,
        });
      })
    );

    res.json({
      rooms: roomList,
      size: global.ROOMS.size,
    });
  })

  .get("/map", (req, res) => {
    let room = global.ROOMS.get(req.query.room);

    if (typeof room === "undefined") {
      res.json({
        error: true,
        message: "Room not found",
      });
      return;
    }

    res.json({
      map: [...room.getCurrentMap().getMap().entries()],
      canvasSize: room.getCurrentMap().getSize(),
    });
  })
  // .get("/reset", (req, res) => {
  //   if (req.query?.pass !== "1337pro") {
  //     res.json({
  //       error: true,
  //     });

  //     return;
  //   }
  //   CurrentMap.reset();

  //   res.json({
  //     success: true,
  //   });
  // })
  .post("/create-room", (req, res) => {
    let width = req.body?.canvasSize.width || "600";
    let height = req.body?.canvasSize.height || "600";

    if (!validator.isInt(String(width))) width = "600";
    if (!validator.isInt(String(height))) height = "600";

    let newRoom = new Room();
    global.ROOMS.set(newRoom.roomId, newRoom);
    newRoom.getCurrentMap().setSize(width, height);

    console.log(
      "[ROOM] Created room: " +
        newRoom.roomId +
        " Size: " +
        width +
        "x" +
        height
    );

    res.json({
      success: true,
      createdRoom: {
        id: newRoom.roomId,
      },
    });
  });

module.exports = router;
