import React from "react";
import styled from "styled-components";
import { lighten, darken } from "polished";

const Wrapper = styled.div`
  background: ${(props) => props.color};
  height: 50px;
  width: 30px;
  height: 100%;
  margin-right: 10px;
  border-radius: 100%;
  cursor: pointer;

  &:last-of-type {
    margin-right: 0px;
  }

  &:hover {
    background: ${(props) => lighten(0.1, props.color)};
  }

  transition: border 0.1s;

  &.selected {
    background: ${(props) => lighten(0.1, props.color)};
    border: 4px solid ${(props) => darken(0.2, props.color)};
  }
`;

export default function Color(props) {
  return <Wrapper {...props} />;
}
