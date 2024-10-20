import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showNotification, setShowNotification] = useState(false); // For showing the notification
    const navigate = useNavigate();

    // Check if a user is already logged in by checking localStorage
    useEffect(() => {
        const currentUserId = localStorage.getItem('current_user_email');
        if (currentUserId) {
            setShowNotification(true); // Show the notification

            // Redirect after showing the notification for 2 seconds
            setTimeout(() => {
                setShowNotification(false);
                navigate('/home');
            }, 2000); // 2-second delay before redirecting
        }
    }, [navigate]);

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

            if (response.ok) {
                const { user } = await response.json();
                localStorage.setItem('current_user_email', user.email); // Store the user's email
                navigate('/home'); // Redirect to home
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="flex flex-col items-center mt-20">
            {showNotification && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-3 text-center animate-slideDown">
                    Already logged in. Redirecting...
                </div>
            )}
            <div className='signup-nav-bar mb-6'>
                <Link to='/'>
                    <div className='logo text-6xl'>Ret<span className="gradient-text">ai</span>n</div>
                </Link>
            </div>
            <div className='signup-form'>
                <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-lg w-72">
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
