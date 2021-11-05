import React from "react";
import styled from "styled-components";
import { lighten } from "@material-ui/core";

const Self = styled.div`
  width: ${(props) => props.size + "px"};
  height: ${(props) => props.size + "px"};
  /* background: rgba(0, 0, 0, 0.5); */
  image-rendering: pixelated;

  border: ${(props) => props.size / 10 + "px"} solid
    ${(props) => lighten(props.color, 0.6)};
  z-index: 100;
  position: absolute;
  pointer-events: none;
`;

const FinalComponent = (props) => <Self {...props}>{props.children}</Self>;

export default FinalComponent;
