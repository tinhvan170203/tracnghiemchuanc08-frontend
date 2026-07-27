import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, styled, Typography } from "@mui/material";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px"
})



export default function DialogConfirmNopBai({
  open,
  onCloseDialogConfirmNopBai,
  onSubmit
}) {
  
  const handleFormSubmit = async () => {
    await onSubmit()
  };

  return (
    <>
      <Dialog
        // maxWidth="xs"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogConfirmNopBai(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
                <DialogTitle
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
            margin: "0 12px",
          }}
        >
          <AutoAwesomeMotionIcon style={{ color: "#333", fontSize: "32px" }} />
          <span>Xác nhận nộp bài</span>
          <CancelButton onClick={() => onCloseDialogConfirmNopBai()}>
            <CancelIcon style={{color: "#d32b2b"}}/>
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <img src="/the end.jpg" alt="img" />
          <p className="text-center">
            Thí sinh có chắc chắn muốn nộp bài thi hay không?
          </p>
          <Box>
              <DialogActions>
                <Button
                  color="error"
                  variant="contained"
                  type="submit"
                  style={{ margin: "4px auto" }}
                  onClick={handleFormSubmit}
                >
                  <span>Đồng ý nộp bài thi</span>
                </Button>
              </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

