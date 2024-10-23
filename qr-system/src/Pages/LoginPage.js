import React from 'react';
import '../Pages/LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
   const navigate=useNavigate();
    
  const handleLectureClick=()=>{
    navigate('/lec-home' );
  }
  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Login</h2>
      </div>
      <form className="login-form">
        <input type="text" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <a href="#" className="forgot-password">Forgot your password?</a>
        <button className="login-button">Login</button>
      </form>
      <div className="temp-buttons">
        <button className="student-btn" >Student Login</button>
        <button className="lecturer-btn"  onClick={handleLectureClick}>Lecturer Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
