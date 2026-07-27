import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, styled, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef } from 'react'
import Giaychungnhan from "../../Giaychungnhan";
function msToHMS(ms) {
  // Đảm bảo ms không âm
  if (ms < 0) ms = 0;

  // 1- Chuyển sang giây:
  let seconds = ms / 1000;

  // 2- Trích xuất giờ:
  const hours = Math.floor(seconds / 3600); // 3,600 giây trong 1 giờ
  seconds = seconds % 3600; // số giây còn lại sau khi trích xuất giờ

  // 3- Trích xuất phút:
  const minutes = Math.floor(seconds / 60); // 60 giây trong 1 phút

  // 4- Giữ lại giây:
  seconds = seconds % 60;

  // Làm tròn giây và đảm bảo có 2 chữ số (ví dụ: 05)
  const formattedSeconds = seconds.toFixed(0).padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  if (hours === 0) {
    return `${formattedMinutes} : ${formattedSeconds}`
  }
  // Định dạng đầy đủ: HH:MM:SS
  const formattedHours = hours.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px"
})



export default function DialogSuccessTest({
  open,
  onCloseDialogSuccessTest,
  result,
  onSubmit,
  onOpenPreviewMode,
  handleSubmitOut
}) {

  const handleFormSubmit = () => {
    onSubmit()
  };

  const refCon = useRef();

  const saveGiaychungnhan = () => {
    if (refCon.current && refCon.current.saveGiaychungnhan) {
      refCon.current.saveGiaychungnhan();
    }
  }
  return (
    <>
      <Dialog
        // maxWidth="xs"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogSuccessTest(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <p className="text-center text-sm md:text-lg uppercase">Cảm ơn bạn đã tham gia hoàn thành bài thu hoạch!</p>
          <img src="/thanks.png" alt="img" />
          <p className="text-center text-sm md:text-lg text-green-700">Chúc mừng bạn đã hoàn thành bài thi với <span className="font-bold">{result.choicedTrue}/{result.allQuestion}</span> câu trả lời đúng trong khoảng thời gian {msToHMS(result.time)}
            {/* , đạt
          <span className="font-bold text-red-800"> {((result.choicedTrue)/(result.allQuestion)*(result.diem)).toFixed(2)} </span>điểm */}
          </p>
          <div>


          </div>
          <div className="md:flex-row md:items-center md:justify-center md:space-x-2 flex flex-col justify-center items-center">
            <Button variant="contained" size="small" onClick={() => saveGiaychungnhan()}>Tải giấy chứng nhận</Button>
            <div>
              <Button
                color="error"
                variant="contained"
                type="submit"
                size="small"
                style={{ margin: "4px auto" }}
                onClick={handleSubmitOut}
              >

                <span>Thoát</span>
              </Button>
            </div>
            <div>
              <Button
                color="info"
                variant="contained"
                type="submit"
                size="small"
                style={{ margin: "4px auto" }}
                onClick={handleFormSubmit}
              >

                <span>Làm lại bài thi</span>
              </Button>
            </div>
            <div>
              <Button
                color="warning"
                variant="contained"
                type="submit"
                size="small"
                style={{ margin: "4px auto" }}
                onClick={onOpenPreviewMode}
              >

                <span>Xem lại bài thi</span>
              </Button>
            </div>
          </div>

        </DialogContent>

        <div style={{ height: 0, overflow: 'hidden', position: 'absolute', zIndex: -1 }}>
          <Giaychungnhan result={result} ref={refCon} />
        </div>
      </Dialog>
    </>
  );
}

