import React from 'react'

const NotFoundCuocthi = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
        <img src="/cong-an-hieu.png" className="md:w-24 w-16" />
        <h3 className='uppercase font-semibold'>Phòng Cảnh sát Giao thông</h3>
        <p className='text-sm text-red-600'>Vui lòng nhập đúng đường link cuộc thi hoặc quét đúng mã QR được cấp</p>
    </div>
  )
}

export default NotFoundCuocthi