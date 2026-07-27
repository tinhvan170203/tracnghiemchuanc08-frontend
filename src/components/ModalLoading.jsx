import * as React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function ModalLoading({open}) {
  return (
    <Backdrop
        sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="flex flex-col items-center">
          <CircularProgress color="primary" className='!text-white' />
          <p className='text-[13px] mt-2'>Đang đồng bộ dữ liệu từ Công an các địa phương</p> 
        </div>
      </Backdrop>
  );
}