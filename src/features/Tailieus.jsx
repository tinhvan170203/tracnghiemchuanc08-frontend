import { Button } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {FileText} from 'lucide-react'
import commonApi from '../api/commonApi';
import { API_SERVER } from '../api/apiServer';
import { HEADER_1, HEADER_2 } from '../../constant/constant';

const Tailieus = () => {

    const [text, setText] = useState('');
    const [list, setList] = useState([]);
    const [listBase, setListBase] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                let res = await commonApi.fetchTailieus();
                setList(res.data)
                setListBase(res.data)
            } catch (error) {
                setList([]);
                console.log(error.message)
            }
        };

        fetch()
    }, [])


  useEffect(() => {
    let data = [...listBase];
    if (data.length > 0) {
      const timer = setTimeout(() => {
        let dataDisplay = data.filter(i => i.text.toLowerCase().includes(text.toLowerCase()))
        setList(dataDisplay)
      }, 500);
      return () => clearTimeout(timer)
    }
  }, [text]);

    return (
        <div className="bg-white pb-2 px-4">
             <div className="shadow-md shadow-slate-400 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
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

            <h3 className='uppercase pt-8 text-sm md:text-lg font-semibold'>
                <MenuBookIcon style={{fontSize: "28px", marginRight: "4px", color: "#ffa500"}}/>
                Cẩm nang an toàn giao thông
            </h3>

            <form className='py-4 px-2 mt-2 flex flex-col space-y-2 shadow-md'>
                <input required value={text} onChange={(e) => setText(e.target.value)} className='outline-none px-2 py-1 text-sm border-slate-500 border rounded-sm' placeholder='Tìm kiếm theo tên tài liệu' />
            </form>

            <div className='mt-8 px-2'>
                {list.length > 0 && list.map(i => (
                    <div key={i._id} className='flex justify-between my-2'>
                        <div className='flex items-center space-x-1' style={{color: "orange"}}>
                            <span className='font-semibold flex items-center'><FileText size={18}/> {i.thutu}. </span>
                            <a className=' text-orange-600 hover:underline text-sm md:text-[16px]' target='_blank' href={`${API_SERVER}c08/uploads/${i.file}`}>{i.text} </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tailieus