import { createStore } from "redux";

function store(
  state = {
    color: "#ff0000",
    pos: {
      x: 0,
      y: 0,
    },
    isConnected: false,
    sharedEnv: {
      isTestVersion: false,
      pixelSize: 0,
      canvasSize: {
        width: 0,
        height: 0,
      },
    },
  },
  action
) {
  if (typeof state === "undefined") {
    return 0;
  }

  switch (action.type) {
    case "COLOR":
      return { ...state, color: action.newColor };
    case "MOUSE_POS":
      return { ...state, pos: action.pos };

    case "IS_CONNECTED":
      return { ...state, isConnected: action.isConnected };

    case "SHARED_ENV":
      return { ...state, sharedEnv: action.sharedEnv };
    default:
      return state;
  }
}

export default createStore(store);
