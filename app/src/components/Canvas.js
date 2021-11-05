import React, { Component } from "react";
import styled from "styled-components";
import store from "../store";
import panzoom from "panzoom";
import socket from "../socket";
import axios from "../axios";
import palette from "../palette";
import { connect } from "react-redux";
import PlaceHolder from "./PlaceHolder";

const ArrayKeyedMap = require("array-keyed-map");

const PaintingArea = styled.canvas`
  /* border: 10px solid #000000; */
  margin: 0;
  padding: 0;
  position: relative;
  image-rendering: pixelated;
  display: block;
  /* 
  &::before {
    content: "";
    position: absolute;
    border-style: solid;
    border-width: 0 16px 16px;
    border-color: red transparent;
    display: block;
    width: 0;
    z-index: 1;
    margin-left: -16px;
    top: -16px;
    left: 50%;
  } */
`;

// const CanvasBorder = styled.div`
//   border: 10px solid #000000;
// `;

const CanvasWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: block;
  cursor: crosshair;
`;

// eslint-disable-next-line no-unused-vars

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef(null);
    this.state = {
      scale: 1,
      lastCoord: { x: 0, y: 0, scale: 1, mX: 0, mY: 0 },
      mapCache: new ArrayKeyedMap(),
      color: "rgba()",
    };
  }

  changePixel(color, coord) {
    this.canvasContext.fillStyle = color;

    // if (color === "white" || color.toLowerCase() === "#ffffff")
    //   this.canvasContext.fillStyle = "rgba(0,0,0,0)";

    this.canvasContext.fillRect(
      coord[0],
      coord[1],
      store.getState().sharedEnv.pixelSize,
      store.getState().sharedEnv.pixelSize
    );
  }

  createBorder = () => {
    this.canvasContext.lineWidth = store.getState().sharedEnv.pixelSize * 2;
    this.canvasContext.setLineDash([
      this.canvasContext.lineWidth,
      this.canvasContext.lineWidth,
    ]);
    this.canvasContext.strokeStyle = "#ff00ff";
    this.canvasContext.strokeRect(
      0,
      0,
      this.props.sharedEnv.canvasSize.width,
      this.props.sharedEnv.canvasSize.height
    );
  };

  loadMap = (map) => {
    this.resetCanvas();

    map = new ArrayKeyedMap(map);

    // this.setState({ ...this.state, mapCache: map });

    // setTimeout(() => {
    map.forEach(async ({ color }, key) => {
      this.changePixel(color, key);
    });
    // }, 500);
  };

  loadMapFromAPI = (room) => {
    axios
      .get("/api/map", {
        params: {
          room: window.location.pathname.replace("/", ""),
        },
      })
      .then(({ data }) => {
        store.dispatch({
          type: "SHARED_ENV",
          sharedEnv: {
            ...store.getState().sharedEnv,
            canvasSize: { ...data.canvasSize },
          },
        });

        this.loadMap(data.map);
      })
      .catch((err) => {
        alert("An error occured while loading map.");
        window.location.reload();
      });
  };

  onPaint = (data) => {
    let { x, y, color } = data;

    this.changePixel(color, [x, y]);

    // this.canvasContext.fillStyle = color;
    // this.canvasContext.fillRect(
    //   x,
    //   y,
    //   store.getState().sharedEnv.pixelSize,
    //   store.getState().sharedEnv.pixelSize
    // );
  };

  componentDidMount() {
    if (this.canvas != null) {
      this.canvasContext = this.canvas.current.getContext("2d");
      this.canvas.current.focus();
    }

    const panzoomInstance = panzoom(this.canvas.current, {
      minZoom: 0.5,

      beforeMouseDown: function (e) {
        if (e.buttons === 4) return;
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
    });

    // if (localStorage.getItem("lastCameraPos") != null) {
    //   let lastCamPos = JSON.parse(localStorage.getItem("lastCameraPos"));

    //   panzoomInstance.moveTo(lastCamPos.x, lastCamPos.y);
    //   panzoomInstance.zoomTo(lastCamPos.x, lastCamPos.y, lastCamPos.scale);

    //   this.setState((oldState) => {
    //     return {
    //       ...oldState,
    //       scale: lastCamPos.scale,
    //     };
    //   });
    // }

    panzoomInstance.on("transform", (e) => {
      localStorage.setItem(
        "lastCameraPos",
        JSON.stringify({ ...panzoomInstance.getTransform() })
      );

      this.setState(
        (oldState) => {
          return {
            ...oldState,
            scale: panzoomInstance.getTransform().scale,
            lastCoord: { ...panzoomInstance.getTransform() },
          };
        },
        () => {
          // this.createBorder();
        }
      );
    });

    socket.on("paint", this.onPaint);
    socket.on("loadMap", this.loadMap);
    // socket.on("connect", this.loadMapFromAPI);
    socket.on("onJoinRoom", this.onJoinRoom);
    socket.on("disconnect", () => {
      window.location.reload();
    });
    socket.on("roomError", () => {
      window.location = "/";
    });

    // this.loadMapFromAPI();

    // for (let x = 0; x < 1920; x++) {
    //   for (let y = 0; y < 1080; y++) {
    //     this.paint({ x: x, y: y });
    //   }
    // }
  }

  onJoinRoom = (room) => {
    this.loadMapFromAPI(room);
  };

  resetCanvas = () => {
    this.canvasContext.clearRect(
      0,
      0,
      this.props.sharedEnv.canvasSize.width || 0,
      this.props.sharedEnv.canvasSize.height || 0
    );

    this.createBorder();
  };

  calculatePlaceholderPosition = (pos) => {
    let pixelSize = store.getState().sharedEnv.pixelSize;
    let scaledPixelSize = pixelSize * this.state.scale;

    pos.mX = pos.mX - ((pos.mX - this.state.lastCoord.x) % scaledPixelSize);
    pos.mY = pos.mY - ((pos.mY - this.state.lastCoord.y) % scaledPixelSize);

    // if (pos.mX - this.state.lastCoord.x < scaledPixelSize)
    //   pos.mX += scaledPixelSize;

    // if (pos.mY - this.state.lastCoord.y < scaledPixelSize)
    //   pos.mY += scaledPixelSize;

    // // console.log(
    // //   pos.mX - this.state.lastCoord.x,
    // //   store.getState().sharedEnv.canvasSize.width - scaledPixelSize
    // // );
    // if (
    //   pos.mX - this.state.lastCoord.x >=
    //   store.getState().sharedEnv.canvasSize.width - scaledPixelSize
    // )
    //   pos.mX -= scaledPixelSize;

    // console.log(
    //   pos.mX - this.state.lastCoord.x >=
    //     store.getState().sharedEnv.canvasSize.width - scaledPixelSize
    // );

    // if (
    //   pos.mY - this.state.lastCoord.y >=
    //   store.getState().sharedEnv.canvasSize.height - scaledPixelSize
    // )
    //   pos.mY -= scaledPixelSize;

    // console.log(pos.mX);
  };

  onMouseMove = (e) => {
    let pos = this.getMousePos(this.canvas.current, e);

    let scale = this.state.lastCoord.scale;

    pos = {
      x: pos.x - (pos.x % store.getState().sharedEnv.pixelSize),
      y: pos.y - (pos.y % store.getState().sharedEnv.pixelSize),

      curX:
        e.clientX -
        (e.clientX % (store.getState().sharedEnv.pixelSize * scale)),
      curY:
        e.clientY -
        (e.clientY % (store.getState().sharedEnv.pixelSize * scale)),
      scale: this.state.lastCoord.scale,

      mX: e.clientX,
      mY: e.clientY,
    };

    this.calculatePlaceholderPosition(pos);

    store.dispatch({ type: "MOUSE_POS", pos });

    if (e.nativeEvent.which !== 1 && e.nativeEvent.which !== 3) {
      let canvasColor = this.canvasContext.getImageData(
        pos.x,
        pos.y,
        1,
        1
      ).data;

      this.setState((oldState) => {
        return {
          ...oldState,
          color: `rgba(${canvasColor[0]},${canvasColor[1]},${canvasColor[2]},255})`,
          lastCoord: {
            ...oldState.lastCoord,
            mX: pos.mX,
            mY: pos.mY,
          },
        };
      });
    }

    if (e.nativeEvent.which !== 1 && e.nativeEvent.which !== 3) return;
    if (e.altKey) return;

    this.setState((oldState) => {
      return {
        ...oldState,
        lastCoord: { ...oldState.lastCoord, mX: pos.mX, mY: pos.mY },
      };
    });

    this.paint(
      pos,
      e.nativeEvent.which === 3 ? "#ffffff" : store.getState().color
    );
  };

  onMouseDown = (e) => {
    let pos = this.getMousePos(this.canvas.current, e);

    pos = {
      x: pos.x - (pos.x % store.getState().sharedEnv.pixelSize),
      y: pos.y - (pos.y % store.getState().sharedEnv.pixelSize),
    };

    if (e.nativeEvent.which !== 1 && e.nativeEvent.which !== 3) return;
    if (e.altKey) return;

    this.setState((oldState) => {
      return {
        ...oldState,
        lastCoord: { ...oldState.lastCoord, which: e.buttons },
      };
    });

    this.paint(
      pos,
      e.nativeEvent.which === 3 ? "#ffffff" : store.getState().color
    );
  };

  paint = (pos, overrideColor = false) => {
    const color = overrideColor ? overrideColor : store.getState().color;

    this.setState((oldState) => {
      return {
        ...oldState,
        color: color,
        lastPaint: { ...pos, color: color },
      };
    });

    // this.canvasContext.fillStyle = store.getState().color;
    // this.canvasContext.fillRect(
    //   pos.x,
    //   pos.y,
    //   store.getState().sharedEnv.pixelSize,
    //   store.getState().sharedEnv.pixelSize
    // );

    socket.emit("paint", {
      ...pos,
      color: color,
      // key: btoa("1337_" + Date.now() + "_l33t"),
    });
  };

  getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();

    let left = rect.left + 0;
    let top = rect.top + 0;
    let right = rect.right + 0;
    let bottom = rect.bottom + 0;
    return {
      x: ((evt.clientX - left) / (right - left)) * canvas.width,
      y: ((evt.clientY - top) / (bottom - top)) * canvas.height,
      ...evt,
    };
  };

  onKeyPressed(e) {
    if (Number(e.key) > 0 && Number(e.key) < palette.length + 1) {
      store.dispatch({
        type: "COLOR",
        newColor: palette[Number(e.key) - 1].color,
      });
    }
  }

  render() {
    return (
      <CanvasWrapper
        onMouseDown={this.onMouseDown}
        onKeyDown={this.onKeyPressed}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <PlaceHolder
          size={store.getState().sharedEnv.pixelSize * this.state.scale}
          borderSize={0}
          color={this.state.color === "#ffffff" ? "#000000" : this.state.color}
          style={{
            transform:
              "translate(" +
              this.state.lastCoord.mX +
              "px," +
              this.state.lastCoord.mY +
              "px)",
            // transform:
            // "translate(" +
            // this.state.lastCoord.mX +
            // "px," +
            // this.state.lastCoord.mY +
            // "px) scale(" +
            // this.state.lastCoord.scale +
            // ")",
          }}
          // onClick={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          // }}
        />
        <PaintingArea
          ref={this.canvas}
          onMouseMove={this.onMouseMove}
          // onWheel={this.onMouseWheel}
          width={this.props.sharedEnv.canvasSize.width || 0}
          height={this.props.sharedEnv.canvasSize.height || 0}
        ></PaintingArea>
      </CanvasWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sharedEnv: state.sharedEnv,
  };
};

export default connect(mapStateToProps)(Canvas);
