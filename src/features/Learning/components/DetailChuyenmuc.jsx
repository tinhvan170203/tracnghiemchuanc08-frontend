import React, { useEffect, useState } from 'react'
// import learningApi from '../../api/learningApi';
import { BookOpen, HelpCircle, ArrowRight, Menu } from 'lucide-react';
import { NavLink, useParams } from "react-router-dom"
import learningApi from '../../../api/learningApi';
import { Button } from '@mui/material';
import {
  getLearnedIds,
  markAsLearned,
  getResumeIndex,
  isDoneAll,
  resetProgress,
} from './utils';
import { HEADER_1, HEADER_2 } from '../../../../constant/constant';
const getProgressPercent = (chuyendeId, soCauHoi) => {
  if (!soCauHoi) return 0;
  const learnedIds = getLearnedIds(chuyendeId);
  // dùng Math.min để phòng trường hợp câu hỏi cũ đã bị xoá khỏi DB
  // nhưng vẫn còn nằm trong localStorage -> tránh % vượt quá 100%
  const learnedCount = Math.min(learnedIds.length, soCauHoi);
  return Math.round((learnedCount / soCauHoi) * 100);
};

const DetailChuyenmuc = () => {
  const [list, setList] = useState([]);
  const [monthi, setMonthi] = useState(null)

  let { id_monthi } = useParams();
  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await learningApi.getChuyendesOfMonthi(id_monthi);
        setList(res.data.chuyendes);
        setMonthi(res.data.monthi)
      } catch (error) {
        alert(error.message)
      }
    };

    fetch()
  }, [id_monthi]);

  return (
    <div>
     <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
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
                    </div>
                </div>

      <p className='py-4 px-2 flex items-center space-x-1 font-semibold text-[14px]'>
        <img src='/logoc08.png' className='w-8' />
        <span>Ôn tập kiến thức pháp luật về TTATGT</span>
      </p>

      <div className='flex items-center space-x-1 mx-2'>
        <Menu size={16} />
        <span className='text-[13px] font-semibold text-orange-600'>{monthi?.tenmonthi}</span>
      </div>

      <div className='flex flex-col md:flex-row md:flex-wrap'>
        {list.map(item => {
          const percent = getProgressPercent(item._id, item.soCauHoi);

          return (
            <div key={item._id} className="w-full md:basis-1/4 px-2 my-3">
              <div className="group relative overflow-hidden bg-gradient-to-tr from-orange-400 to-orange-50 rounded-2xl border border-amber-500 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10">

                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80 transition-opacity group-hover:opacity-100" />

                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex-shrink-0 rounded-xl bg-orange-50 p-2 border border-orange-100 group-hover:scale-105 transition-transform">
                    <img src="/cong-an-hieu.png" alt="Công an hiệu" className="h-9 w-9 object-contain" />
                  </div>
                  <h3 className="text-[13px] text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-3 rounded-xl bg-white p-3 border border-orange-100/80 transition-colors group-hover:bg-orange-50">
                    <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Câu hỏi</p>
                      <p className="text-[18px] font-bold text-orange-700">{item.soCauHoi}</p>
                    </div>
                  </div>
                </div>

                {/* Thanh progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">Tiến độ học tập</span>
                    <span className="text-xs font-bold text-orange-600">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white to-green-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <NavLink to={`/tu-kiem-tra/${item.link_test}`}>
                      <div className="flex items-center hover:cursor-pointer  text-xs font-semibold text-gay-600 pt-1 group-hover:translate-x-1 transition-transform">
                        <span className='uppercase'>Tự kiểm tra</span>
                        {/* <MovingIcon className="h-4 w-4 ml-1" /> */}
                      </div>
                    </NavLink>
                  </div>
                  <NavLink to={`/chuyendes/${item._id}/cauhois`}>
                    <div className="flex items-center hover:cursor-pointer justify-end text-xs font-semibold text-orange-600 pt-1 group-hover:translate-x-1 transition-transform">
                      <Button startIcon={<ArrowRight size={18} />} size='small' color='warning' variant='contained'>
                        {percent === 100 ? 'Học lại' : percent > 0 ? 'Học tiếp' : 'Vào học'}
                      </Button>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  )
}

export default DetailChuyenmuc