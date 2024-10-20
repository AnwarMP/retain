import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(''); // Initialize email state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email, 
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Error signing up. Please try again.');
            }

            const data = await response.json(); // Get response data
            // const { email: responseEmail } = data; // Extract user email from the response

            // Store email in localStorage
            localStorage.setItem('current_user_email', data.email); 
            navigate('/home'); // Redirect to home page
        } catch (error) {
            console.error('Signup failed:', error);
            setError(error.message); // Set error message
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className='signup-nav-bar mb-6'>
                <Link to='/'>
                    <div className='logo text-6xl'>Ret<span className="gradient-text">ai</span>n</div>
                </Link>
            </div>
            <div className='signup-form'>
                <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-lg w-72">
                    <div className="field mb-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="field mb-4">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="field mb-4">
                        <input
                            type="text"
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

                    <div className="field mb-4">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                            Sign Up
                        </button>
                    </div>
                    <div className="login-link mt-4 text-gray-600">
                        <Link to="/login" className='nav-button'>
                            Already have an account? <span className='underline decoration-sky-500'> Log in. </span>
                        </Link>
                    </div>
                </form>
            </div>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        </div>
    );
};

export default Signup;
