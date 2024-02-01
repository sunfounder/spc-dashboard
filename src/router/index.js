import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/home.jsx';
// import Minimal from '../components/minimal.jsx';

export default function IndexRouter(props) {
  return (

    <Home {...props} />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/dashboard" element={<Home {...props} />} />
    //     <Route path="/minimal" element={<Minimal {...props} />} />
    //     <Route
    //       path="/"
    //       element={
    //         <Navigate to="/dashboard" replace />
    //       }
    //     />
    //   </Routes>
    // </BrowserRouter>
  );
}