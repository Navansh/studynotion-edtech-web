import React from 'react'
import { Link } from 'react-router-dom'

const CTAbutton = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={` text-center text-base font-bold px-6 py-3 rounded-md
        ${active ? "bg-yellow-50 text-black box_shadow_2" : "bg-richblack-800 box-shadow_1"}
        hover:scale-95 transition-all duration-200 `}>
            {children} 
        </div>
    </Link>
  )
}

export default CTAbutton