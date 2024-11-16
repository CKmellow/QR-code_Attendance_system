import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { id, password };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.status === 200) {
                // Store the user information in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));

                // Navigate based on user role
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

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={id}
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

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default LoginPage;
