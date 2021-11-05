import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  /* width: 100%; */
  display: flex;

  ${(props) =>
    (props.justify || "center") === "center" &&
    `
    left: 50%;
    transform: translateX(-50%);
    `}
  z-index:1000;
  justify-content: ${(props) => props.justify || "center"};
`;

const FinalComponent = (props) => (
  <Wrapper
    onClick={(e) => e.preventDefault()}
    onMouseMove={(e) => e.preventDefault()}
    {...props}
  >
    {props.children}
  </Wrapper>
);

export default FinalComponent;
