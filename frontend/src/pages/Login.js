import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For redirecting after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const { user } = await response.json(); // Extract user from the response
            localStorage.setItem('current_user_id', user.id); // Store user ID in localStorage
            navigate('/home'); // Redirect to home page
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.message); // Set error message
        }
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <div className='signup-nav-bar mb-6'>
                <Link to='/'>
                    <div className='logo text-6xl'>Ret<span className="gradient-text">ai</span>n</div>
                </Link>
            </div>
            <div className='signup-form'>
                <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-lg w-72">
                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                    <div className="field mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="School Email"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="field mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full p-2 bg-blue-600 text-white transition ease-in-out rounded-lg hover:bg-blue-500">
                            Log In
                        </button>
                    </div>
                    <div className="login-link mt-4 text-gray-600">
                        <Link to="/signup" className='nav-button'>
                            Don't have an account? <span className='underline decoration-sky-500'>Sign up.</span> 
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
