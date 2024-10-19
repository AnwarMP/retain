import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';

const Signup = () => {
    return (
      <body>
        <div className='signup-nav-bar'>
            <Link to='/'><div className='logo'>Ret<span className="gradient-text">ai</span>n</div></Link>
        </div>
        <div className='signup-form'>
            <form>
                <div className="field">
                    <input type="text" name="firstName" placeholder="First Name" required />
                </div>

                <div className="field">
                    <input type="text" name="lastName" placeholder="Last Name" required />
                </div>

                <div className="field">
                    <input type="email" name="email" placeholder="School Email" required />
                </div>

                <div className="field">
                    <input type="password" name="password" placeholder="Password" required />
                </div>

                <div className="field">
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                </div>

                <div>
                    <button type="submit">Sign Up</button>
                </div>
                <div className="login-link">
                    <Link to="/login" className='nav-button'>Already have an account? Log in.</Link>
                </div>
            </form>
        </div>
      </body>
    );
  };
  
  export default Signup;