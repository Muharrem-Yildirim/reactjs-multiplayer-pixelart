import React, { useEffect } from "react";
import styled from "styled-components";
import MenuWrapper from "./MenuWrapper";
import Card from "./Card";
import { useSelector } from "react-redux";
import socket from "../socket";

const InformationText = styled.span`
  color: white;
  /* font-weight: bold; */
  font-size: 14px;
  font-family: "Noto Sans", sans-serif;
`;

const VerticalCard = styled(Card)`
  margin-right: 0px;
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0px !important;
  }
`;

export default function TopMenu() {
  const pos = useSelector((state) => state.pos);
  const sharedEnv = useSelector((state) => state.sharedEnv);
  const [userCount, setUserCount] = React.useState(0);

  useEffect(() => {
    // socket.emit("requestClientCount");

    socket.on("onJoinRoom", (count) => {
      socket.emit("requestClientCount", function (count) {
        setUserCount(count);
      });
    });

    socket.emit("requestClientCount", function (count) {
      setUserCount(count);
    });

    socket.on("clients", (count) => {
      setUserCount(count);
    });
  }, []);

  return (
    <MenuWrapper
      justify="left"
      style={{
        top: 10,
        left: 10,
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <VerticalCard className="animate__animated animate__fadeInDown">
        <InformationText>
          Press <u>Left Alt + Left Mouse</u> or <br />
          <u>Middle Mouse</u> to move camera.
        </InformationText>
      </VerticalCard>

      <VerticalCard className="animate__animated animate__fadeInDown">
        <InformationText>
          X: {pos.x} <br />
          Y: {pos.y} <br />
          Width: {sharedEnv.canvasSize.width} <br />
          Height: {sharedEnv.canvasSize.height} <br />
          Online: {userCount}
        </InformationText>
      </VerticalCard>
    </MenuWrapper>
  );
}
