import React from 'react'

const TrackingChoice = ({questions}) => {
  return (
    <div className='flex flex-wrap'>
      {questions?.map((question, index)=>{
        return ( question.choice !== undefined ? (
          <div key={question._id} className="h-[28px] w-[28px] rounded-sm bg-blue-900 flex items-center justify-center mx-1 mt-1">
            <span className='text-white'>{index + 1}</span>
          </div>
        ) : (
          <div key={question._id} className="h-[28px] w-[28px] rounded-sm bg-slate-500 flex items-center justify-center mx-1 mt-1">
          <span className='text-white'>{index + 1}</span>
        </div>
        )
        )
      })}
    </div>
  )
}

export default TrackingChoice