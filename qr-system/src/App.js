import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import LecHome from './Pages/LecHome';
import StudentHome from './Pages/StudentHome';

function App() {
  return(
    <Router>
    <Routes>

      <Route path='/'element={<LoginPage />} />
      <Route path='/login'element={<LoginPage />} />
      <Route path='/lec-home'element={<LecHome />} />
      <Route path='/stu-home' element={<StudentHome/>}/>
    </Routes>
    </Router>
  );
}

export default App;
