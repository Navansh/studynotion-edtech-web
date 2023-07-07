import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { resetPassword } from '../services/operations/authAPI'
import { useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
    const {loading} = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.pathname.split("/").at(-1);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    };
        
  return (
    <div className='text-richblack-5  min-h-[calc(100vh-3.5rem)] place-items-center '>
        {
            loading ? (<div className="loader"></div>) :
            (
                <div>
                    <h2>Choose New Password</h2>
                    <p>Almost done, Enter your new password and you're all Set</p>
                    <form onSubmit={handleOnSubmit}>
                        <label htmlFor="" className='relative z-0'>
                            <p>New Password <sup className=' text-[#910000]'>*</sup></p>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder='Enter new password'
                                name='password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    }
                                }
                                className=' w-full p-6 bg-richblack-600 text-richblack-5'
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {
                                    showPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    )
                                }
                            </span>
                        </label>
                        <label htmlFor="" className='relative z-0'>
                            <p>Confirm Password <sup className=' text-[#910000]'>*</sup></p>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder='Confirm new password'
                                name='password'
                                value={confirmPassword}
                                className=' w-full p-6 bg-richblack-600 text-richblack-5'
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    }
                                }
                            />
                            <span
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer transition-all duration-200">
                                {
                                    showConfirmPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    )
                                }
                            </span>
                        </label>

                        <button type='submit'>
                            Reset Password

                        </button>
                    </form>

                    <div className=' flex '>
                        <Link to="/login" className=' w-full flex gap-1 items-center '>
                            <FaArrowLeft></FaArrowLeft>
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>

            )
        }
    </div>
  )
}

export default UpdatePassword