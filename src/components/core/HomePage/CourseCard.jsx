import React from 'react'
import { MdPeople } from 'react-icons/md'
import { RiOrganizationChart } from 'react-icons/ri'

const CourseCard = ({heading, description,level, lessonNumber, currentCard, setCurrentCard}) => {
  return (
    <div className={`${currentCard === heading ? " bg-richblack-5 shadow-[12px_12px_0_0] shadow-yellow-50" : "bg-richblack-800 text-white" } flex flex-col gap-3 lg:w-[30%]`} onClick={() => setCurrentCard(heading)} >
        <div className={` pt-[32px] px-6 pb-[72px] gap-3 flex flex-col h-[80%] `}>
            <p className={`${currentCard === heading ? "text-richblack-900" : "text-white "} font-semibold text-[20px] `}>{heading}</p>
            <p className={`${currentCard === heading ? "text-richblack-900" : "text-richblack-300 "} text-[16px] `}>{description}</p>
        </div>

        <div className={` ${currentCard === heading ? " border-richblue-300" : " border-richblack-500"} flex justify-between py-4 px-6 gap-4 border-t-2 border-dashed`}>
            <div className=' flex items-center gap-2'>
                <MdPeople className={`${currentCard === heading ? " text-[##0A5A72]" : "text-richblack-300"}`} size={20}></MdPeople>
                <p className={`${currentCard === heading ? " text-[##0A5A72]" : "text-richblack-300"}`}>{level}</p>
            </div>
            <div className='flex items-center gap-2'>
                <RiOrganizationChart className={`${currentCard === heading ? " text-[##0A5A72]" : "text-richblack-300"}`} size={20} ></RiOrganizationChart>
                <p className={`${currentCard === heading ? " text-[##0A5A72]" : "text-richblack-300"}`}> {lessonNumber} </p>
            </div>
        </div>
    </div>
  )
}

export default CourseCard