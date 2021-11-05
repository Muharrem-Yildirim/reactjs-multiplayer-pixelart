import openSocket from "socket.io-client";

let socket;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  socket = openSocket("http://localhost:1337", {
    query: {
      room: window.location.pathname.replace("/", ""),
    },
  });
} else {
  socket = openSocket({
    query: {
      room: window.location.pathname.replace("/", ""),
    },
  });
}

export default socket;
