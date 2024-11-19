import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import LecHome from './Pages/LecHome';
import StudentHome from './Pages/StudentHome';
import LecturerClassDetails from './components/lecturclassdetails';
import StudentAttendance from './components/StudentView/StudentAttendance';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/lec-home' element={<LecHome />} />
        <Route path='/stu-home' element={<StudentHome />} />
        <Route path='/class-details/lecturer/:courseId' element={<LecturerClassDetails />} />
        <Route path="/attendance/:courseId/" element={<StudentAttendance />} />
      </Routes>
    </Router>
  );
}

export default App;
