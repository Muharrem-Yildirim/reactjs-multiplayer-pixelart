/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
// import styled from "styled-components";
import MenuWrapper from "./MenuWrapper";
import Color from "./Color";
import Card from "./Card";
import store from "../store";
import palette from "../palette";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useSelector } from "react-redux";
// import { Button } from "@material-ui/core";

// const ResetButton = styled(Button)`
//   color: white !important;
// `;

export default function BottomMenu() {
  const [currentColor, setCurrentColor] = useState(0);
  const color = useSelector((state) => state.color);
  const snackbar = useSnackbar();

  const changeColor = (e, idx) => {
    let newCol = palette[idx];

    store.dispatch({ type: "COLOR", newColor: palette[idx].color });

    localStorage.setItem("selectedColor", idx);

    snackbar.showMessage(
      <span>
        Color changed to{" "}
        <span style={{ color: newCol.color, fontWeight: "bold" }}>
          {newCol.name}
        </span>
      </span>
    );

    setCurrentColor(idx);
  };

  const mountRef = useRef(false);

  useEffect(() => {
    if (!isNaN(parseInt(localStorage.getItem("selectedColor"))))
      changeColor(null, parseInt(localStorage.getItem("selectedColor")));
  }, []);

  useEffect(() => {
    let idx = palette.findIndex((el) => el.color === color);

    if (idx < 0 || idx > palette.length - 1) return;

    if (mountRef.current === false) {
      mountRef.current = true;
      return;
    }

    changeColor(null, idx);
  }, [color]);

  return (
    <MenuWrapper
      style={{
        bottom: 10,
      }}
    >
      {/* <Card
        className="animate__animated animate__fadeInUp"
        style={{ height: 50 }}
      >
        <span>
          <ResetButton
            // onClick={this.reset}
            onClick={() => window.location.reload()}
            variant="text"
          >
            Reset
          </ResetButton>
        </span>
      </Card> */}
      <Card
        className="animate__animated animate__fadeInUp"
        style={{ height: 50, borderRadius: 25 }}
      >
        {palette.map((el, idx) => {
          return (
            <Color
              {...el}
              className={currentColor === idx && "selected"}
              // className={
              //   currentColor === idx &&
              //   "selected animate__animated animate__jello"
              // }
              key={idx}
              onClick={(e) => {
                changeColor(e, idx);
              }}
            />
          );
        })}
      </Card>
    </MenuWrapper>
  );
}
