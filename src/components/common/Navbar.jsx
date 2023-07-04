import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import {NavbarLinks} from '../../data/navbar-links.js'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
//useSelector is a hook that allows you to extract data from the Redux store state, using a selector function.
const Navbar = () => {

    //fetching the states
    const {token} = useSelector(state => state.auth);

    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({path : route}, location.pathname)
        // console.log(window.location.pathname);
    }
    // matchRoute('/about');
  return (
    <div className=' flex h-14 items-center justify-center border-b border-b-richblack-700'>
        <div className=' flex w-11/12 max-w-maxContent mx-auto justify-between items-center'>

            <Link to = {"/"}>
                <img src={Logo} width={160} loading='lazy' alt='sdsd'/>
            </Link>

            {/* Navlinks  */}
            <nav>
                <ul className=' flex gap-x-6 text-richblack-25 '>
                    {
                        NavbarLinks.map((link, index) => {
                            return (
                               <li key={index}>
                                    {
                                        link.title === 'Catalog' ?
                                        (<div></div>) : 
                                        <Link to = {link?.path}>
                                        {/* the ?. operator is used to access the path property of the link object. If link is null or undefined, the expression will short-circuit and return undefined, without throwing an error. */}
                                           <p className={` ${matchRoute(link?.path) ? " text-yellow-25" : " text-richblack-25"}`}>{link.title}</p> 
                                        </Link>

                                    }
                               </li>
                            )
                        })
                    }
                </ul>
            </nav>

            {/* Login, Signup, Dashboard buttons */}
            <div className=' flex items-center gap-x-4'>
                
            </div>

        </div>
    </div>
  )
}

export default Navbar