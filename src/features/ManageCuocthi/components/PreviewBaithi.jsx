import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, Paper, styled, Typography } from "@mui/material";
import CauhoiDathi from "./CauhoiDathi";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px"
})


export default function PreviewBaithi({
  open,
  onCloseDialogEdit,
  item
}) {
  return (
    <>
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogEdit(event, reason);
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
          <span>Xem chi tiết bài thi của thí sinh {item?.thisinh.hoten} - SBD {item?.thisinh.sbd}</span>
          <CancelButton onClick={() => onCloseDialogEdit()}>
            <CancelIcon style={{color: "#d32b2b"}}/>
          </CancelButton>
        </DialogTitle>
        <DialogContent>
        <div className="md:px-12 py-4 md:mx-10 mt-4 px-2">
          <p className="mb-4">Phương án thí sinh tích chọn có màu xanh da trời. Những câu hỏi thí sinh trả lời sai, đáp án đúng là đáp án được tô đỏ.</p>
            {(item?.baithi.questions.length > 0) && item?.baithi.questions.map((question, index) => (
              <CauhoiDathi
                key={question.question._id}
                question={question}
                index={index + 1}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
