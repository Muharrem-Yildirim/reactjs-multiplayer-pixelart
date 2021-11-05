const mongoose = require("mongoose");

const MapModel = new mongoose.Schema(
  {
    room_id: { type: String, unique: true },
    data: String,
    size: {
      width: { type: Number },
      height: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("map", MapModel);
