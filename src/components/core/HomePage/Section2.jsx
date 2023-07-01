import React from 'react'
import CTAbutton from './CTAbutton'
import { FaArrowRight } from 'react-icons/fa' 
import HighlightTextBlue from './HighlightTextBlue'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import TimelineImage from "../../../assets/Images/TimelineImage.png"
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import Compare_with_others from "../../../assets/Images/Compare_with_others.png"
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png"

// import bgHome from "../../../assets/Images/bgHome.svg"
const Section2 = () => {

    const timelineData = [
        {
            id: 1,
            logo : Logo1 ,
            heading : "Leadership",
            subheading : "Fully committed to the success of company",
            last : false
        },
        {
            id: 2,
            logo : Logo2 ,
            heading :"Responsibility",
            subheading : "Students will always be our top priority",
            last : false
        },
        {
            id: 3,
            logo :  Logo3 ,
            heading : "Flexibility",
            subheading : "The ability to switch is an important skills",
            last : false
        },
        {
            id: 4,
            logo :  Logo4 ,
            heading : "Solve the problem",
            subheading : "Code your way to a solution",
            last : true
        }
    ]
  return (
    <div className=' bg-pure-greys-5 text-richblack-700'>
        <div className=' homepage_bg h-[320px]' >
            <div className=' w-11/12 max-w-maxContent h-full flex flex-row items-center justify-center mx-auto gap-5'>
                <CTAbutton active={true} linkto={"/signup"}>
                    <div className=' flex flex-row gap-2 items-center'>
                        Explore Full Catalog 
                        <FaArrowRight></FaArrowRight>
                    </div>
                    
                </CTAbutton>
                <CTAbutton active={false} linkto={"/login"}>Learn More</CTAbutton>

            </div>
        </div>

        <div className=' mt-24 w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-center gap-7'>
            {/* Skills Section  */}
            <div className=' flex flex-row justify-between'>
                <div className=' w-[45%] text-[36px]'>
                    Get the skills you need for a {" "}   <HighlightTextBlue text={"job that is in demand."}></HighlightTextBlue>
                </div>
                <div className=' w-[40%] text-[16px]'>
                    <p className=''>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills</p> 
                    <div className=' mt-9 w-fit'>
                        <CTAbutton active={true} className=" ">Learn More</CTAbutton>
                    </div>
                </div>

            </div>

            {/* TimeLine Section */}
            <div className=' mt-24 flex flex-row gap-14'>

                {/* Left Part  */}
                <div className=' w-[45%] flex flex-col'>
                    {/* //TimeLine Section */}
                    {

                        timelineData.map((item, index) => {
                            let isLastChild = index === timelineData.length - 1;

                        const itemProperties = isLastChild
                            ?  'hidden' :
                            'hidden lg:block h-14 border-dotted border-l ml-6 border-richblack-100 bg-richblack-400/0 w-[26px]';

                        return (
                            <div key={item.id} className=''>
                                <div className=' flex flex-row gap-6 py-4 w-full' key={item.id}>
                                    <div className='w-[50px] whiteboxshadow rounded-full px-2 py-2 h-[50px] bg-white flex justify-center items-center'>
                                        <img src={item.logo} alt={item.id}/>
                                    </div>
                                    <div className=' flex flex-col '>
                                        <p className=' text-[18px] font-semibold'>{item.heading}</p>
                                        <p className=' text-[14px] '>{item.subheading}</p>
                                    </div>
                                </div>
                                <div className={`${itemProperties}`}>
                                    {console.log(item.last)}
                                </div>
                            </div>
                        )   
                    })
                }</div>

                {/* Right Part  */}
                {/* //we are marking this as relative as iske upar hame kuch overlap karna hai  */}
                <div className=' relative'>
                    <img src={TimelineImage} alt="" className=' relative object-cover h-fit z-30 boxshadowtimeline' />
                    <div className='  bluegradient absolute -top-5 left-14 z-10'>
                        <div className="w-[692px] h-[395px]" />         
                    </div>
                    <div className=' max-w-[511px] absolute bg-caribbeangreen-700 z-40 -bottom-1 flex flex-row text-white uppercase py-10 px-10 gap-12
                            translate-x-[16%] translate-y-6'>
                        <div className=' flex flex-row gap-6 items-center border-r border-caribbeangreen-300'>
                            <p className=' text-3xl font-bold'>10</p>
                            <p className=' text-caribbeangreen-300 text-sm font-inter'>Years of Experience</p>
                        </div>

                        <div className='flex flex-row gap-6 items-center'>
                            <p className=' text-3xl font-bold'>250</p>
                            <p className=' text-caribbeangreen-300 text-sm font-inter'>Types of Courses</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className=' flex flex-col gap-5 mt-24'>
                <div className=' text-4xl font-semibold text-center '>
                    Your swiss knife for <HighlightTextBlue text={"learning any language"}></HighlightTextBlue>
                </div>
                <div className=' text-base text-richblack-600 text-center w-[70%] mx-auto'>
                    <p>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</p>
                </div>

                <div className=' flex flex-row items-center justify-center mt-5'>
                    <img src={Know_your_progress} alt="" className=' object-contain lg:-mr-32'/>
                    <img src={Compare_with_others} alt="" className=' object-contain lg:-mb-10 lg:-mt-0 -mt-12' />
                    <img src={Plan_your_lessons} alt="" className=' object-contain lg:-ml-36 lg:-mt-5 -mt-16'/>
                </div>

            </div>
        </div>

    </div>
  )
}

export default Section2