import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [_id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignup, setShowSignup] = useState(false); // Toggle between login and signup
  const [signupData, setSignupData] = useState({
    fname: '',
    lname: '',
    _id: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { _id, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'student') {
          navigate('/stu-home');
        } else if (data.user.role === 'lecturer') {
          navigate('/lec-home');
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setErrorMessage('Signup successful! You can now log in.');
        setShowSignup(false);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>{showSignup ? 'Signup' : 'Login'}</h2>
      {!showSignup ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={_id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter ID"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={signupData.fname}
            onChange={(e) => setSignupData({ ...signupData, fname: e.target.value })}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={signupData.lname}
            onChange={(e) => setSignupData({ ...signupData, lname: e.target.value })}
            placeholder="Last Name"
            required
          />
          <input
            type="text"
            value={signupData._id}
            onChange={(e) => setSignupData({ ...signupData, _id: e.target.value })}
            placeholder="Enter ID"
            required
          />
          <input
            type="password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            placeholder="Enter Password"
            required
          />
          <select
            value={signupData.role}
            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
          <button type="submit">Signup</button>
        </form>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button
        className="toggle-button"
        onClick={() => setShowSignup(!showSignup)}
      >
        {showSignup ? 'Go to Login' : 'Go to Signup'}
      </button>
    </div>
  );
};

export default LoginPage;
