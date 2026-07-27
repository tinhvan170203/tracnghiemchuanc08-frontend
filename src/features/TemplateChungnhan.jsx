import React, { useEffect, useState, useRef } from 'react';
import commonApi from '../api/commonApi';

function msToHMS(ms) {
  if (ms < 0 || !ms) ms = 0;
  let seconds = ms / 1000;
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const formattedSeconds = seconds.toFixed(0).padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  if (hours === 0) {
    return `${formattedMinutes} phút ${formattedSeconds} giây`;
  }
  const formattedHours = hours.toString().padStart(2, '0');
  return `${formattedHours} giờ ${formattedMinutes} phút ${formattedSeconds} giây`;
}

const formatDate = (timestamp) => {
  if (!timestamp) return '01/01/1970'; // Tránh lỗi Epoch time khi timestamp rỗng/null
  const date = new Date(Number(timestamp));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Button } from '@mui/material';

const TemplateChungnhan = ({ result }) => {
  const [name, setName] = useState('');
  const [tencuocthi, setTencuocthi] = useState('');
  const [mabaithi, setMabaithi] = useState('');
  const [socaudung, setSocaudung] = useState(0);
  const [socauhoi, setSocauhoi] = useState(0);
  const [time, setTime] = useState(0);
  const [thoigianbatdau, setThoigianbatdau] = useState('');

  const certificateRef = useRef(null);

  useEffect(() => {
    if (result) {
      setName(result.name);
      try {
        const storedInfo = localStorage.getItem("thongtinthisinh");
        if (storedInfo) {
          setTencuocthi(JSON.parse(storedInfo).tencuocthi);
        }
      } catch (e) {
        console.error("Lỗi parse localStorage:", e);
      }
      setMabaithi(result.mabaithi);
      setSocaudung(result.choicedTrue);
      setSocauhoi(result.allQuestion);
      setTime(result.time);
      setThoigianbatdau(result.thoigianbatdau);
    }
  }, [result]);

  // const handleDownload = async () => {
  //     if (certificateRef.current === null) return;
  
  //     try {
  //       // Tăng pixelRatio để ảnh sắc nét hơn (phù hợp để in ấn)
  //       try {
  //         const dataUrl = await toPng(certificateRef.current, {
  //           cacheBust: true,
  //           pixelRatio: 2
  //         });
  //         download(dataUrl, `${name}_${mabaithi}.png`);
  
  //       } catch (error) {
  //         console.log(error.message)
  
  //       }
  //     } catch (err) {
  //       console.error('Lỗi khi xuất ảnh:', err);
  //     }
  //   };
  
  //     // 2. Xuất hàm này ra để Cha có thể nhìn thấy và gọi được
  //   useImperativeHandle(ref, () => ({
  //     saveGiaychungnhan: handleDownload
  //     // Bạn có thể thêm các hàm khác như resetForm, validate... ở đây
  //   }));
  return (
    /* THAY ĐỔI QUAN TRỌNG: Thêm relative và overflow-hidden ở div cha */
    <div ref={certificateRef} className='w-[800px] mx-auto relative overflow-hidden select-none'>
      
      {/* Ảnh làm nền */}
      <img src="/c08chungnhan.png" alt="giaychungnhan" className='w-full h-auto block' />

      {/* Nội dung đè lên - Căn chỉnh chính xác theo tỉ lệ ảnh */}
      <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start pointer-events-none'>
        
        {/* Tên người nhận */}
        <p className='mt-[30%] font-bold uppercase text-[32px] text-blue-900 line-clamp-1 w-[80%] text-center'>
          {name || 'Tạ Vũ Quang'}
        </p>

        {/* Kết quả câu hỏi */}
        <p className='mt-[2.5%] text-[13px] italic text-center font-semibold text-gray-800'>
          Đã hoàn thành <span className='font-bold'>{socaudung}/{socauhoi}</span> câu trả lời đúng trong {msToHMS(time)}
        </p>
        
        {/* Tên cuộc thi - Giải quyết tràn viền (Giới hạn dòng hoặc thu nhỏ text tự động nếu quá dài) */}
        <div className='mt-[2%] max-w-[70%] h-[55px] flex items-center justify-center'>
          <p className='italic text-red-700 text-center font-sans text-[13px] leading-tight line-clamp-3 break-words whitespace-normal'>
            Tại: {tencuocthi || "Trung học Phổ thông Văn Giang"} 
          </p>
        </div>

        {/* Mã bài thi */}
        <p className='mt-[6%] text-[13px] italic font-semibold text-center text-gray-700'>
          Mã bài thi: <span className='font-semibold'>{mabaithi || 'N/A'}</span>
        </p>
        
        {/* Ngày chứng nhận */}
        <p className=' text-[13px] text-center text-gray-700'>
          Ngày chứng nhận: <span className='font-semibold'>{formatDate(thoigianbatdau)}</span>
        </p>

      </div>
    </div>
  );
};

export default TemplateChungnhan;