import React from 'react'
import Spinner from '../components/common/Spinner'
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

const Dashboard = () => {

    const { loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)
    //we are using the useSelector hook to get the loading state from the profile and auth slices. and also giving them aliases(namely profileLoading and authLoading) so that we can use them in our component.

    if (profileLoading || authLoading) {
        //if any of the loading states are true, we will show a spinner
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <Spinner />
          </div>
        )
    }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>    
  )
}

export default Dashboard