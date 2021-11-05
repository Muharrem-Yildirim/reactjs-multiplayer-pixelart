import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: #424242;
  min-height: 16px;
  /* width: auto; */
  border-radius: 10px;

  position: relative;
  padding: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;

  user-select: none;

  overflow: hidden;

  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);

  margin-right: 10px;

  &:last-of-type {
    margin-right: 0px;
  }
`;

const FinalComponent = (props) => <Card {...props}>{props.children}</Card>;

export default FinalComponent;
