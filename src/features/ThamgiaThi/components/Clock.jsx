import React, { useRef, useEffect, useState } from "react";
// Hàm chuyển đổi mili giây sang định dạng Giờ, Phút, Giây (Tiếng Việt)
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

const Clock = ({ thoigianketthuc, onHandleSubmitTest, stop, timeNow }) => {
  const [num, setNum] = useState(1000000000000000);
  const [show, setShow] = useState(false)
  const intervalRef = useRef();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (timeNow) {
      let timeBack = thoigianketthuc - timeNow;
      setShow(true)
      setNum(timeBack)
    }
  }, [timeNow, thoigianketthuc])

  const decreaseNum = () => setNum((prev) => prev - 1000);

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Hết giờ: chỉ auto-submit đúng 1 lần
  useEffect(() => {
    if (num <= 0 && show && !stop && !submittedRef.current) {
      submittedRef.current = true;
      clearInterval(intervalRef.current);
      onHandleSubmitTest();
    }
  }, [num, show, stop, onHandleSubmitTest])

  useEffect(() => {
    if (stop) {
      submittedRef.current = true;
      clearInterval(intervalRef.current);
    }
  }, [stop])

  return (
    <>
      {show && (
        <div className="[text-shadow:_1px_1px_2px_black] text-white md:text-white text-sm md:text-lg font-semibold">{msToHMS(num)}</div>
      )}
    </>
  )
}

export default Clock
