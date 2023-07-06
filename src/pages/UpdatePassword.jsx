import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

const UpdatePassword = () => {
    const {loading} = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className='text-richblack-5  min-h-[calc(100vh-3.5rem)] place-items-center '>
        {
            loading ? (<div className="loader"></div>) :
            (
                <div>
                    <h2>Choose New Password</h2>
                    <p>Almost done, Enter your new password and you're all Set</p>
                    <form>
                        <label htmlFor="">
                            <p>New Password <sup className=' text-[#910000]'>*</sup></p>
                            <input 
                                type="password" 
                                required
                                placeholder='Enter new password'
                                name='password'
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    }
                                }
                                
                            />
                        </label>
                        <label htmlFor="">
                            <p>Confirm Password <sup className=' text-[#910000]'>*</sup></p>
                            <input
                                type="password"
                                required
                                placeholder='Confirm new password'
                                name='password'
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    }
                                }
                            />
                        </label>
                    </form>
                </div>

            )
        }
    </div>
  )
}

export default UpdatePassword