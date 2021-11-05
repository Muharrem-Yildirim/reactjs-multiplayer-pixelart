import "./App.scss";
import Canvas from "./components/Canvas";
import BottomMenu from "./components/BottomMenu";
import TopMenu from "./components/TopMenu";
import Loading from "./components/Loading";
import InfoModal from "./components/modals/InfoModal";
import SessionModal from "./components/modals/SessionModal";
import { useSelector } from "react-redux";
import "animate.css";
import React from "react";
import axios from "./axios";
import store from "./store";

function App(props) {
  const isConnected = useSelector((state) => state.isConnected);

  React.useEffect(() => {
    axios
      .get("/api/get-environment-vars")
      .then(({ data }) => {
        store.dispatch({
          type: "SHARED_ENV",
          sharedEnv: { ...store.getState().sharedEnv, ...data },
        });
      })
      .catch((err) => {
        alert("An error occured while loading map.");
      });
  }, []);

  return (
    <div>
      <Loading>Connecting to server..</Loading>
      <Canvas />
      <SessionModal />
      {window.location.pathname.replace("/", "") !== "" && <InfoModal />}
      {isConnected === true &&
        window.location.pathname.replace("/", "") !== "" && (
          <>
            <BottomMenu />
            <TopMenu />
          </>
        )}
    </div>
  );
}

export default App;
