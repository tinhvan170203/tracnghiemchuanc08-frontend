import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, Paper, styled, Typography } from "@mui/material";
import commonApi from "../api/commonApi";
import { useState } from "react";
import CauhoiPreview from "./CauhoiPreview";

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
  onCloseDialogPreviewBaithi,
  idBaithi
  //   item
}) {

  const [questions, setQuestions] = useState([]);
  const [choicedTrue, setChoicedTrue] = useState(0);
  //  const [questions, setQuestions] = useState([]);

  React.useEffect(() => {
    const fetch = async (req, res) => {
      try {
        let res = await commonApi.previewTest(idBaithi);
        setChoicedTrue(res.data.choicedTrue)
        // console.log(res)

        let arr = [];
        res.data.questionList.forEach(item => {
          let options_question = [];
          item.options_sort.forEach(i => options_question = [...options_question, { [i]: item.questionlist[i] }]);
          const result = options_question.map(item => {
            return Object.fromEntries(
              // Lọc những cặp [key, value] mà value KHÁC rỗng
              Object.entries(item).filter(([key, value]) => value !== "")
            );
          }).filter(item => Object.keys(item).length > 0);;

          // console.log(result)
          arr.push({ question: item.questionlist.question, image: item.questionlist.image, answer: item.questionlist.answer, choice: item.choice, _id: item.questionlist._id, options: result })
        });

        setQuestions(arr)
      } catch (error) {
        console.log(error.message)
      }
    };

    if (open === true) {
      fetch()
    }
  }, [idBaithi, open]);


  return (
    <>
      <Dialog
        maxWidth="2xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogPreviewBaithi(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{ zIndex: 1500 }} // Giá trị mặc định của Dialog là 1300
      >
        {/* <DialogTitle
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
            margin: "0 12px",
          }}
        > */}
          {/* <AutoAwesomeMotionIcon style={{ color: "#333", fontSize: "32px" }} /> */}
          <CancelButton onClick={() => onCloseDialogPreviewBaithi()}>
            <CancelIcon style={{ color: "#d32b2b" }} />
          </CancelButton>
        {/* </DialogTitle> */}
        <div className="px-1 py-2">
          <div className="md:px-12 py-4 md:mx-2 mt-4">
            <p className="text-sm md:text-[16px] font-semibold">Bạn đã trả lời đúng {choicedTrue} đáp án.</p>
            <p className="mb-4 italic text-red-600 text-sm md:text-[16px]"> Những câu hỏi bạn trả lời sai, đáp án đúng là đáp án được tô đỏ.</p>
            {questions?.map((question, index) => (
              <CauhoiPreview
                key={question._id}
                question={question}
                index={index + 1}
              // onHandleChangeChoice={handleChangeChoice}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
