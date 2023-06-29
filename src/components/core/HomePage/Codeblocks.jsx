import React from 'react'
import CTAbutton from './CTAbutton'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'

const Codeblocks = (
    {position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}
) => {
  return (
    <div className={`flex ${position} my-[5.5rem] justify-between`}>
        {/* Section 1  */}
        <div className='w-[50%] flex flex-col gap-8'>
            <div>{heading}</div>
            <div className=' text-richblack-300 font-bold'>{subheading}</div>

            <div className=' flex gap-7 mt-7'>
                <CTAbutton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className=' flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight />
                    </div>
                </CTAbutton>


                <CTAbutton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}
                </CTAbutton>
            </div>

        </div>

        {/* Section 2  */}
        <div className=' h-fit flex text-[16px] lg:w-[534px] px-8 py-8 '>
            {/* BG Gradient  */}

            <div className=' text-center flex flex-col w-[10%] text-richblue-400 font-inter font-bold'> 
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 ${codeColor} font-mono font-bold`}>
                <TypeAnimation
                sequence={[codeblock, 10000, ""]}
                repeat={Infinity}
                cursor={true}
                omitDeletionAnimation ={true}
                style={
                    {
                        whiteSpace: "pre-line",
                        display: "block",

                    }
                }

                >

                </TypeAnimation>

            </div>

        </div>

    </div>
  )
}

export default Codeblocks