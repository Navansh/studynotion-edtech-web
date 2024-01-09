import React from 'react'
import Spinner from '../components/common/Spinner'
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'

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
        {/* this lets us render a child component of the Dashboard component. This child component will be rendered based on the route that is matched. For example, if the route is /dashboard/my-courses, then the MyCourses component will be rendered. If the route is /dashboard/add-course, then the AddCourse component will be rendered. This is how we can render different components based on the route. */}
          <Outlet />
        </div>
      </div>
    </div>    
  )
}

export default Dashboard