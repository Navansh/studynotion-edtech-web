import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Section1 from '../components/core/HomePage/Section1';
import Section2 from '../components/core/HomePage/Section2';
const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <Section1 />
        {/* Section 2  */}
        <Section2></Section2>
        {/* Section 3  */}
        {/* Footer  */}
    </div>
  )
}

export default Home