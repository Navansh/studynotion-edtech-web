import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa'
import HighlightTextBlue from './HighlightTextBlue'
import CTAbutton from './CTAbutton'
import Codeblocks from './Codeblocks'
import {HomePageExplore} from '../../../data/homepage-explore.js'
import CourseCard from './CourseCard'
import { AiOutlineArrowRight } from 'react-icons/ai'

const Section1 = () => {

  const tabsName = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skills Paths",
    "Career Paths",
  ];

  const [currentTab, setCurrentTab] = React.useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[1].heading);



  // const setMyTab = (tab) => {
  //   setCurrentTab(tab);
  //   HomePageExplore.map((item) => {
  //     if (item.tag === tab) {
  //       setCourses(item.courses);
  //       console.log(item.courses);
  //       setCurrentCard(item.courses[1].heading);
  //       console.log(item.courses[1].heading);
  //     }
  //     return null;
  //   });
  // };

  const setMyCards = (value) => {
    setCurrentTab(value);
    console.log(value)
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    console.log(courses)
    setCurrentCard(result[0].courses[1].heading);
    console.log(result[0]);
  };

  return (
    <div className=' relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-white justify-between'>
        <Link to = {"/signup"}>
            <div className='mx-auto box-shadow_1 p-1 mt-16 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit group'>
                <div className=' flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight></FaArrowRight>
                </div>
            </div>
        </Link>

        <div className=' text-center text-4xl font-semibold mt-9'>
          Empower Your Future with <HighlightTextBlue text={"Coding Skills"}/>
        </div>

        <div className="w-[85%] mt-4 text-center text-[16px] font-inter text-richblack-300 font-bold leading-normal">
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className=' flex flex-row gap-7 mt-8'>
           <CTAbutton active={true} linkto = {"/signup"}>Learn more</CTAbutton>
           <CTAbutton active={false} linkto = {"/login"}>Book a Demo</CTAbutton>
        </div>

        <div className='relative mx-3 my-14  '>
          <div className='  bluegradient absolute -top-5 left-14 z-10'>
            <div className="w-[992px] h-[595px]" />         
          </div>
          <video muted loop autoPlay className='boxshadowwhite relative z-30   ' >
            <source src="https://res.cloudinary.com/dsnnvjuqz/video/upload/v1687624391/banner_nl2exy.mp4" className='
           ' type='video/mp4'/>
          </video>
        </div>

        {/* Code Section 1  */}
        <div>
          <Codeblocks
            position={"lg:flex-row"}
            heading={
              <div className=' text-4xl font-bold'>
                Unlock Your <HighlightTextBlue text={"Coding Potential"}/> with our Online Courses
              </div>
            }
            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
            ctabtn1={
              {
                btnText : "Try it Yourself",
                active : true,
                linkto : "/signup"
              }
            }
            ctabtn2={
              {
                btnText : "Learn More",
                active : false,
                linkto : "/login"
              }
            }
            codeblock={`<!DOCTYPE html>\n<html><head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
            backgroundGradient={"bg-gradient-to-br from-purple-600 via-amber-500 to-slate-50"}
            codeColor={"text-yellow-25"}
            

          ></Codeblocks>
        </div>

        <div>
        <Codeblocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className=' text-4xl font-bold'>
               Start <HighlightTextBlue text={"coding in seconds"}/>
              </div>
            }
            subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
            ctabtn1={
              {
                btnText : "Continue Lesson",
                active : true,
                linkto : "/signup"
              }
            }
            ctabtn2={
              {
                btnText : "Learn More",
                active : false,
                linkto : "/login"
              }
            }
            codeblock={`<!DOCTYPE html>\n<html><head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
            backgroundGradient={"bg-gradient-to-br from-purple-600 via-amber-500 to-slate-50"}
            codeColor={"text-yellow-25"}
            

          ></Codeblocks>
        </div>

        <div>
            <div className=' text-4xl font-semibold text-center'>
              Unlock the <HighlightTextBlue text={"Power of Code"}/>
            </div>

            <p className=' text-center text-richblack-300 text-lg font-semibold mt-3'>Learn to build anything you can Imagine</p>

            <div className=' hidden lg:flex gap-5 mt-5 mb-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
              {
                tabsName.map((tab) => {
                  return (
                    <div
                      key={tab}
                      onClick={() => setMyCards(tab)}
                      className={`${
                        currentTab === tab ? "text-richblack-5  font-medium bg-richblack-900" : "text-richblack-200"
                      } cursor-pointer rounded-full text-[16px] px-5 py-2 transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5`}
                    >
                      {tab}
                    </div>
                  );
                }
                )
              }
            </div>

            {/* //adding div for height purposes  */}
            <div className="hidden lg:block lg:h-[200px]"></div>

            {/* //Course Card ka Group  */}
            <div className=' lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
              {
                courses.map((course, index) => {
                  return (
                      <CourseCard
                        heading = {course.heading}
                        description={course.description}
                        level = {course.level}
                        lessonNumber = {course.lessonNumber}
                        currentCard={currentCard}
                        setCurrentCard={setCurrentCard}
                        key={course.heading}
                      />
                  )
                }
                )
              }
            </div>
        </div>
    </div>
  )
}

export default Section1