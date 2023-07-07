import React, { useEffect,useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import {NavbarLinks} from '../../data/navbar-links.js'
import { useSelector } from 'react-redux'
//useSelector is a hook that allows you to extract data from the Redux store state, using a selector function.
import {AiOutlineShoppingCart} from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { categories } from '../../services/apis'
import { apiConnector } from '../../services/apiConnector'
import {BiChevronDown} from 'react-icons/bi'
const Navbar = () => {

    //fetching the states
    const {token} = useSelector((state) => state.auth);
    console.log(token)
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);
    //this is taken using the slices from the redux store
    const location = useLocation();

    const [sublinks, setSublinks] = useState([]);

    async function fetchSublinks() {
        try {
            const result = await apiConnector('GET', categories.CATEGORIES_API);
            setSublinks(result.data.data)
            console.log("Printing sublinks result",sublinks) 

        } catch (error) {
            console.log("Could not fetch the navbar sublinks",error)
        }
    }

    useEffect(() => {
        fetchSublinks();
    }, [])


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
                                        (<div className=' relative flex items-center group'>
                                            <p>{link.title}</p>
                                            <BiChevronDown className=' text-richblack-25 text-xl' />

                                            <div className=' invisible absolute left-[5%] -translate-x-28 top-[40px] flex flex-col
                                             rounded-md bg-richblack-5 p-4 z-10 text-richblue-900 opacity-0 transition-all duration-200 group-hover:visible
                                              group-hover:opacity-100 lg:w-[300px]'  >
                                                {
                                                  sublinks &&  sublinks.length ? (
                                                    sublinks.map((sublink, index) => {
                                                        return (
                                                            <div className=' hover:bg-richblack-100 z-10 p-3 rounded-lg' key={index}>
                                                                <Link to = {`/catalog/${sublink?.name}`} >
                                                                    <p>{sublink?.name}</p>
                                                                </Link>
                                                            </div>

                                                        )
                                                    })
                                                   ) : (<div></div>)
                                                }
                                                <div className=' absolute left-[50%] z-[3] -top-1 h-6 w-6 rotate-45 rounded bg-richblack-5'>

                                                </div>
                                            </div>

                                        </div>) : 
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
            <div className=' flex items-center gap-x-4 '>

                {
                    user && user?.accountType !== "Instructor" &&  (
                        //cart button
                        <Link to = {`/dashboard/cart`} className=' relative'>
                            <AiOutlineShoppingCart className=' text-richblack-25 text-2xl' />
                            {
                                totalItems > 0 && (
                                    <div className=' absolute -top-2 -right-2 bg-yellow-25 w-5 h-5 rounded-full flex items-center justify-center text-richblack-500 text-xs font-semibold'>
                                        {totalItems}
                                    </div>
                                )
                            }
                        </Link>

                        
                    ) 
                }
                {
                    token ? (
                        /* <Link to = {`/dashboard/${user?.username}`}>
                            <button className=' px-6 py-2 rounded-full bg-yellow-25 text-richblack-500 font-semibold hover:bg-yellow-50 transition-all duration-200'>
                                Dashboard
                            </button>
                        </Link> */
                        <ProfileDropDown/>
                    ) : (
                        <>
                            <Link to = {"/login"}>
                                <button className=' px-6 py-1 rounded-full bg-yellow-25 text-richblack-500 font-semibold hover:bg-yellow-50 transition-all duration-200'>
                                    Login
                                </button>
                            </Link>
                            <Link to = {"/signup"}>
                                <button className=' px-6 py-1 rounded-full bg-yellow-25 text-richblack-500 font-semibold hover:bg-yellow-50 transition-all duration-200'>
                                    Signup
                                </button>
                            </Link>
                        </>
                    )

                }
            </div>

        </div>
    </div>
  )
}

export default Navbar