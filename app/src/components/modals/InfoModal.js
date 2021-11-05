import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";

export default function InfoModal() {
  const [open, setOpen] = React.useState(false);
  // const location = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  const isTestVersion = useSelector((state) => state.sharedEnv.isTestVersion);

  React.useEffect(() => {
    if (isTestVersion && !window.location.host.includes("localhost"))
      setOpen(true);
  }, [isTestVersion]);

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Warning
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Canvas gets reset every 10 minute because this is test version.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
