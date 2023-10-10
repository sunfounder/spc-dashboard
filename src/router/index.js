import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/home.jsx';
import Minimal from '../components/minimal.jsx';

export default function IndexRouter(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home {...props} />} />
        <Route path="/minimal" element={<Minimal {...props} />} />
        <Route
          path="/"
          element={
            // localStorage.getItem('token') ? (
            //   <Iogin />
            // ) : (
            //   <Navigate to="/hom" replace />
            //   )
            <Navigate to="/home" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}