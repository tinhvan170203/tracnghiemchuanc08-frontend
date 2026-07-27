import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Paper, Button, Grid, Radio } from "@mui/material";
import dayjs from "dayjs";
import commonApi from "../../../api/commonApi";
import Clock from "../components/Clock";
import Cauhoi from "../components/Cauhoi";
import ModalLoading from './../../../components/ModalLoading';
import DialogSuccessTest from "../components/DialogSuccessTest";
import PreviewBaithi from "../../../components/PreviewBaithi";
import CryptoJS from 'crypto-js';
import { HEADER_1, HEADER_2 } from "../../../../constant/constant";

const saveEncryptedExam = (questionList, secretKey) => {
  try {
    // 1. Chuyển Object/Array sang chuỗi JSON
    const dataString = JSON.stringify(questionList);

    // 2. Mã hóa AES với secretKey
    const encrypted = CryptoJS.AES.encrypt(dataString, secretKey).toString();

    // 3. Lưu vào localStorage
    localStorage.setItem('question_list', encrypted);
  } catch (error) {
    console.error("Lỗi mã hóa:", error);
  }
};

const getDecryptedExam = (secretKey) => {
  try {
    // 1. Lấy chuỗi đã mã hóa từ storage
    const encryptedData = localStorage.getItem('question_list');
    if (!encryptedData) return null;

    // 2. Giải mã bằng secretKey
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    // 3. Chuyển ngược lại thành Object/Array
    return JSON.parse(decryptedText);
  } catch (error) {
    // Nếu key sai hoặc dữ liệu bị sửa đổi, hàm sẽ lỗi
    console.error("Lỗi giải mã (Có thể do sai Key hoặc dữ liệu bị can thiệp):", error);
    return null;
  }
};

const Test = () => {

  const [timeNow, SetTimeNow] = useState(null)
  const [openDialogSuccessTest, setOpenDialogSuccessTest] = useState(false);

  const handleCloseDialogSuccessTest = () => {
    setOpenDialogSuccessTest(false);
  };

  const handleOpenDialogSuccessTest = () => {
    setOpenDialogSuccessTest(true);
  };

  const [openDialogPreviewBaithi, setOpenDialogPreviewBaithi] = useState(false);

  const handleCloseDialogPreviewBaithi = () => {
    setOpenDialogPreviewBaithi(false);
  };

  const handleOpenDialogPreviewBaithi = () => {
    setOpenDialogPreviewBaithi(true);
  };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [thisinh, setThisinh] = useState(() => {
    return JSON.parse(localStorage.getItem("thongtinthisinh"));
  });

  const [questions, setQuestions] = useState([]);
  const [secretKey, setSecretKey] = useState(null)

  const [thongtinbaithi, setThongtincuocthi] = useState(() => {
    return JSON.parse(localStorage.getItem("thongtinbaithi"));
  });

  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({
    choicedTrue: 0,
    allQuestion: 0,
    time: 0,
    mabaithi: "",
    thoigianbatdau: "",
  })
  const [stop, setStop] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // useEffect(() => {

  // }, [])

  useEffect(() => {
    if (!thisinh || !questions || !thongtinbaithi) {
      navigate("/");
    }

    let checkedTest = async () => {
      // hàm kiểm tra xem bài thi này đã hoàn thành trên thiết bị khác hay chưa
      try {
        let res = await commonApi.checkedTest(thongtinbaithi._id);
  
        setSecretKey(res.data.secretKey)
        // let questionList = JSON.parse(localStorage.getItem("question_list"));
        let questionList = getDecryptedExam(res.data.secretKey);
      
        if (!questionList) return;
        let arr = [];
        questionList.forEach(item => {
          let options_question = [];
          item.options_sort.forEach(i => options_question = [...options_question, { [i]: item.questionlist[i] }]);
          const optionsMap = options_question.map(item => {
            return Object.fromEntries(
              // Lọc những cặp [key, value] mà value KHÁC rỗng
              Object.entries(item).filter(([key, value]) => value !== "")
            );
          }).filter(item => Object.keys(item).length > 0);;
          arr.push({ question: item.questionlist.question, image: item.questionlist.image, choice: item.questionlist.choice, _id: item.questionlist._id, options: optionsMap })
        });

        setQuestions(arr)
        SetTimeNow(res.data.timeNow)
      } catch (error) {
        navigate("/");
      }
    };

    checkedTest();
  }, []);

  //handle change choice question
  const handleChangeChoice = (id_question, choice) => {
    // console.log(id_question, choice)
    let newQuestions = questions.map(question => {
      if (question._id.toString() === id_question) {
        return { ...question, choice }
      } else {
        return question
      }
    });

    // let x = JSON.parse(localStorage.getItem('question_list'));
    let x = getDecryptedExam(secretKey);
    let question_change = x.find(e => e.questionlist._id === id_question);

    question_change.questionlist.choice = choice;
    // localStorage.setItem('question_list', JSON.stringify(x));
    saveEncryptedExam(x, secretKey)
    setQuestions(newQuestions);
  };


  //submit nộp bìa thi
  const handleSubmitTest = async () => {
    try {
      setLoading(true);
      let res = await commonApi.submitTest(thongtinbaithi._id, questions);
      setResult({
        ...result, choicedTrue: res.data.choicedTrue,
        name: res.data.name,
        allQuestion: res.data.allQuestion,
        time: res.data.timeTest,
        mabaithi: res.data.mabaithi,
        thoigianbatdau: res.data.thoigianbatdau
      });
      setLoading(false);
      setStop(true);
      setOpenDialogSuccessTest(true);
    } catch (error) {
      console.log(error)
      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  }

  const handleSubmitOut = () => {
    localStorage.removeItem('thongtinthisinh')
    localStorage.removeItem('question_list')
    localStorage.removeItem('thongtinbaithi')
    setOpenDialogSuccessTest(false)
    navigate(-2)
  };

  const handleSubmitSuccess = () => {
    localStorage.removeItem('thongtinthisinh')
    localStorage.removeItem('question_list')
    localStorage.removeItem('thongtinbaithi')
    setOpenDialogSuccessTest(false)
    navigate(-1)
  };


  return (
    <div>
      <div className="flex-1">
        {/* <div className="shadow-md shadow-slate-400 h-[150px] md:h-auto bg-center py-2 bg-cover sticky top-0 bg-[url('/bannermobile.png')] md:bg-[url('/backgroundesktop.png')] z-10 flex justify-center"> */}
        <div className="shadow-md shadow-slate-400  md:h-auto bg-center py-2 bg-cover sticky top-0 bg-[url('/nentrongdong.png')] z-10 flex justify-center">
          <div className="">
            <div className="flex items-center justify-center" >
              <img src="/cong-an-hieu.png" className="md:w-24 w-12" />
              <img src="/logoc08.png" className="md:w-[64px] w-8" />
            </div>
            <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
              {HEADER_1}
            </h3>
            <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
              {HEADER_2}
            </h3>
            <div className="text-center">
              <Clock timeNow={timeNow} stop={stop} onHandleSubmitTest={handleSubmitTest} thoigianketthuc={thongtinbaithi?.thoigianketthuc} />
            </div>
          </div>
        </div>
        <h3 className="text-center text-sm mt-4 md:text-[18px] text-[#ab0000] font-semibold md:font-normal">
          {thisinh?.tencuocthi}
        </h3>
        <p className="text-center font-semibold text-[12px] md:text-[18px]">
          Ngày tổ chức:{" "}
          {dayjs(thisinh?.ngaytochucthi).format("DD/MM/YYYY")}
        </p>

        <div className="md:px-12 mt-2 py-1 md:mx-10 px-2 shadow-sm shadow-slate-700" >
          {questions?.map((question, index) => (
            <Cauhoi
              key={question._id}
              question={question}
              index={index + 1}
              onHandleChangeChoice={handleChangeChoice}
            />
          ))}
        </div>

        <div className="flex items-center justify-center my-2 mb-[140px]">
          <Button
            variant="contained"
            // style={{ width: "100%", marginTop: "16px" }}
            onClick={() => handleSubmitTest()}
          >
            Nộp bài kiểm tra
          </Button>
        </div>

        <div className="px-2 bg-yellow-200 bg-cover bg-center mt-4 fixed bottom-0 w-full py-1">
        <div className="flex justify-center mt-2">
          <img src="/logoc08.png" alt="logo" className="w-8 md:w-12" />
        </div>
          <p className="text-center font-semibold text-[12px] text-[#ab0000] md:text-[16px] ">Bản quyền thuộc về Công an tỉnh Hưng Yên</p>
          <p className="text-center text-[12px] font-normal text-[#ab0000] md:text-[16px]">Ứng dụng công nghệ thông tin trong công tác tuyên truyền, phổ biến, giáo dục pháp luật về trật tự an toàn giao thông</p>
        </div>

        {open && <ModalLoading />}


        <DialogSuccessTest
          open={openDialogSuccessTest}
          onCloseDialogSuccessTest={handleCloseDialogSuccessTest}
          result={result}
          onSubmit={handleSubmitSuccess}
          onOpenPreviewMode={handleOpenDialogPreviewBaithi}
          handleSubmitOut={handleSubmitOut}
        // onReplayTest={replayTest}
        />

        <PreviewBaithi
          open={openDialogPreviewBaithi}
          onCloseDialogPreviewBaithi={handleCloseDialogPreviewBaithi}
          idBaithi={thongtinbaithi?._id}
        />

        <ModalLoading open={isLoading} />
      </div>
    </div>
  );
};

export default Test;
