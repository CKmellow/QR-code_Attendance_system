import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import LecHome from './Pages/LecHome';

function App() {
  return(
    <Router>
    <Routes>

      <Route path='/'element={<LoginPage />} />
      <Route path='/lec-home'element={<LecHome />} />
    </Routes>
    </Router>
  );
}

export default App;
