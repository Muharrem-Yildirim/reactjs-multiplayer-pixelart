import React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import socket from "../socket";
import store from "../store";

const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1338;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  font-family: "Noto Sans", sans-serif;
  flex-direction: column;
`;

export default class FinalComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getIntinialState();
  }

  getIntinialState = () => {
    return {
      isConnected: false,
      isHiding: false,
      hideCompletely: false,
    };
  };
  componentDidMount() {
    socket.on("connect", this.onLoadingEnd);
    socket.on("getMap", this.onLoadingEnd);
    socket.on("disconnect", this.startLoading);
  }

  startLoading = () => {
    store.dispatch({ type: "IS_CONNECTED", isConnected: false });

    this.setState(this.getIntinialState());

    if (typeof this.timer1 !== "undefined") {
      clearTimeout(this.timer1);
    }

    if (typeof this.timer2 !== "undefined") {
      clearTimeout(this.timer2);
    }
  };

  onLoadingEnd = () => {
    if (this.hideCompletely) return;
    if (this.isHiding) return;

    if (typeof this.timer1 !== "undefined") {
      clearTimeout(this.timer1);
    }

    if (typeof this.timer2 !== "undefined") {
      clearTimeout(this.timer2);
    }

    this.setState((oldState) => {
      return { ...oldState, isHiding: true };
    });

    this.timer1 = setTimeout(
      () =>
        this.setState(
          (oldState) => {
            return { ...oldState, isConnected: true };
          },
          () => {
            this.timer2 = setTimeout(
              () => {
                this.setState((oldState) => {
                  return { ...oldState, hideCompletely: true };
                });

                store.dispatch({ type: "IS_CONNECTED", isConnected: true });
              },

              600
            );
          }
        ),
      250
    );
  };

  render() {
    return (
      <>
        {!this.state.hideCompletely && (
          <Loading
            {...this.props}
            className={
              this.state.isConnected && "animate__animated animate__fadeOut"
            }
          >
            <CircularProgress color="inherit" style={{ marginBottom: 20 }} />
            {this.props.children}
          </Loading>
        )}
      </>
    );
  }
}
