import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import styled from "styled-components";
import axios from "../../axios";
import socket from "../../socket";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormControlSpaced = styled(FormControl)`
  margin-bottom: 10px !important;

  &:last-of-type {
    margin-bottom: 0px !important;
  }
`;

export default function SessionModal() {
  const [open, setOpen] = React.useState(true);
  const [size, setSize] = React.useState({ width: 600, height: 600 });

  const handleClose = () => {
    setOpen(false);
  };

  const createSession = () => {
    axios.post("/api/create-room", { canvasSize: size }).then(({ data }) => {
      window.location.href = "/" + data.createdRoom.id;
    });
  };

  React.useEffect(() => {
    socket.on("onJoinRoom", () => {
      handleClose();
    });
  }, []);

  const onChange = (e) => {
    let limitedValue = e.target.value;

    // if (limitedValue < 50) limitedValue = 50;
    // if (limitedValue < 50) limitedValue = 50;
    if (limitedValue > 1000) limitedValue = 1000;
    if (limitedValue > 1000) limitedValue = 1000;

    setSize((oldSize) => {
      return {
        ...oldSize,
        [e.target.id]: limitedValue,
      };
    });
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle onClose={handleClose}>Create Session</DialogTitle>
        <DialogContent dividers>
          <Form>
            {/* <FormControlSpaced>
              <InputLabel htmlFor="room_name">Room Name</InputLabel>
              <Input id="room_name" />
            </FormControlSpaced> */}
            <FormControlSpaced>
              <InputLabel htmlFor="width">Canvas Width</InputLabel>
              <Input
                id="width"
                value={size.width}
                required
                type="number"
                onChange={onChange}
              />
            </FormControlSpaced>
            <FormControlSpaced>
              <InputLabel htmlFor="height">Canvas Height</InputLabel>
              <Input
                id="height"
                value={size.height}
                required
                type="number"
                onChange={onChange}
              />
            </FormControlSpaced>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={createSession} color="inherit">
            Create Session
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
