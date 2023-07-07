import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import CTAbutton from '../components/core/HomePage/CTAbutton'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { getPasswordResetToken } from '../services/operations/authAPI'
const ForgotPassword = () => {
    const {loading} = useSelector((state) => state.auth)    
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    function changeHandler(e) {
        setEmail(e.target.value);
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));

    }

  return (
    <div className=' flex   text-richblack-5  min-h-[calc(100vh-3.5rem)] place-items-center '>
        {
            loading ? (<div className="loader"></div>) :

            (
                <div className=' h-screen flex flex-col justify-center max-w-[300px] mx-auto gap-3'>
                    <h2>
                        {
                            emailSent ? "Check your Email" : "Reset your Password"
                        }
                    </h2>

                    <p>
                        {
                            emailSent ? `We have sent the reset email to ${email}` : "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label htmlFor="">
                                    <p>Email Address</p>
                                    <input type="email" name="email" id="" required 
                                    value={email} onChange={changeHandler}
                                    placeholder='Enter your email'
                                    style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                                    />
                                </label>
                            )
                        }

                        <button type='submit'>
                            {
                                emailSent ? "Resend Email" : "Reset Password"
                            }
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

export default ForgotPassword