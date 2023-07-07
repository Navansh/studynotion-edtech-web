import React, { useEffect } from 'react'
import OTPInput from 'react-otp-input'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { FaRedoAlt } from 'react-icons/fa'
import { sendOtp, signUp } from '../services/operations/authAPI'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
    const {loading, signupData} = useSelector((state) => state.auth)
    const [otp, setOtp] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //signupData  is the data that is saved in the redux store after the user has entered his details in the signup form
    //we use it when we the user has entered the otp and we now want to signup the user

    //handling the case when the user has not entered any data in the signup form
    useEffect(() => {
        if(!signupData){
            navigate('/signup')
        }
    }, [])



    const handleOnSubmit = (e) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
        } = signupData;

        dispatch(signUp(accountType,firstName, lastName, email, password, confirmPassword, otp, navigate))
        
    }
  return (
    <div className='text-richblack-5  min-h-[calc(100vh-3.5rem)] place-items-center '>
        {
            loading ? (<div className="loader"></div>) :
            (
                <div className=' flex items-center flex-col justify-center h-full'>
                    <h2>Verify Email</h2>
                    <p>A verification code has been sent to your Email, Enter the code below</p>
                    <form action="" onSubmit={handleOnSubmit}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} className=' text-richblack-5 bg-richblack-800' />}
                            // containerStyle="w-full"
                            inputStyle="w-full p-6 bg-richblack-600 text-white"
                            focusStyle="w-full p-6 bg-richblack-600 text-richblack-5"
                        />

                        <button type='submit'>
                            Verify Email
                        </button>
                    </form>

                    <div>
                        <div className=' flex '>
                            <Link to="/login" className=' w-full flex gap-1 items-center '>
                                <FaArrowLeft></FaArrowLeft>
                                <p>Back to Login</p>
                            </Link>
                        </div>

                        <div onClick={() => dispatch(sendOtp(signupData.email,navigate))}>
                            <FaRedoAlt></FaRedoAlt>
                            <p>Resend Code</p>
                        </div>

                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail


