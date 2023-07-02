import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightTextBlue from './HighlightTextBlue'
import CTAbutton from './CTAbutton'
import { FaArrowRight } from 'react-icons/fa'
const Section3 = () => {
  return (
    <div className=' w-11/12 max-w-maxContent mx-auto flex flex-col text-white'>
        {/* Become an Instructor  */}
        <div className=' py-24 flex flex-row gap-20 items-center'>
            <div className=' w-[50%]'>
                <img src={Instructor} alt="" className='shadow-[-20px_-20px_0_0]' />
            </div>

            <div className=' flex flex-col w-[50%] gap-10'>
                <div className=' text-[36px] w-[50%] leading-tight font-semibold'>
                     Become an <HighlightTextBlue text='instructor' />
                </div>
                <p className=' font-medium text-[16px] w-[80%] text-richblack-300'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                <div className=' w-fit'>
                    <CTAbutton active={true} linkto={'/signup'}>
                        <div className=' flex items-center gap-2'>
                            Start Teaching Today <FaArrowRight></FaArrowRight>
                        </div>
                    </CTAbutton>
                </div>
            </div>
        </div>

        {/* Reviews Section  */}
        <div className='py-10'>
            <h2 className=' text-4xl text-center font-semibold'>Reviews from other learners</h2>
        </div>
    </div>
  )
}

export default Section3