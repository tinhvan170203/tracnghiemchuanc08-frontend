import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
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
  idBaithi,
  secretKey,
  Mode
}) {

// sửa chỉ xem lại những câu sai
  const [questions, setQuestions] = useState([]);
  const [choicedTrue, setChoicedTrue] = useState(0);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        // Thí sinh: public + secretKey | Admin: JWT (không cần secretKey)
        let res = secretKey
          ? await commonApi.previewTest(idBaithi, secretKey)
          : await commonApi.previewTestAdmin(idBaithi);
        setChoicedTrue(res.data.choicedTrue)

        let arr = [];
        res.data.questionList.forEach(item => {
          let options_question = [];
          item.options_sort.forEach(i => options_question = [...options_question, { [i]: item.questionlist[i] }]);
          const result = options_question.map(item => {
            return Object.fromEntries(
              Object.entries(item).filter(([key, value]) => value !== "")
            );
          }).filter(item => Object.keys(item).length > 0);;


          //sửa chỉ lấy ra danh sách các câu hỏi sai
          if(Mode && Mode === "Chỉ xem câu sai" && item.questionlist.answer !== item.choice){
            console.log(1)
            arr.push({ question: item.questionlist.question, image: item.questionlist.image, answer: item.questionlist.answer, choice: item.choice, _id: item.questionlist._id, options: result })
          };
          
         if(Mode !== "Chỉ xem câu sai"){
            arr.push({ question: item.questionlist.question, image: item.questionlist.image, answer: item.questionlist.answer, choice: item.choice, _id: item.questionlist._id, options: result })
          }
        });

        setQuestions(arr)
      } catch (error) {
        console.log(error.message)
      }
    };

    if (open === true && idBaithi) {
      fetch()
    }
  }, [idBaithi, open, secretKey]);


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
          <CancelButton onClick={() => onCloseDialogPreviewBaithi()}>
            <CancelIcon style={{ color: "#d32b2b" }} />
          </CancelButton>
        {/* </DialogTitle> */}
        <div className="px-1 py-2">
          <div className="md:px-12 py-4 md:mx-2 mt-4">
            <p className="text-sm md:text-[16px] font-semibold">Bạn đã trả lời đúng {choicedTrue} câu.</p>
            <p className="mb-4 italic text-red-600 text-sm md:text-[16px]"> Dưới đây là {questions.length} câu câu bạn đã trả lời sai:</p>
            {questions?.map((question, index) => (
              <CauhoiPreview
                key={question._id}
                question={question}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
