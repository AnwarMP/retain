import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css'; //same format
import '../Styles/Universal.css';

const Login = () => {
    return (
      <body>
        <div className='signup-nav-bar'>
            <Link to='/'><div className='logo'>Ret<span className="gradient-text">ai</span>n</div></Link>
        </div>
        <div className='signup-form'>
            <form>
                <div className="field">
                    <input type="email" name="email" placeholder="School Email" required />
                </div>

                <div className="field">
                    <input type="password" name="password" placeholder="Password" required />
                </div>
                <div>
                    <button type="submit">Log In</button>
                </div>
                <div className="login-link">
                    <Link to="/signup" className='nav-button'>Don't have an account? Sign up.</Link>
                </div>
            </form>
        </div>
      </body>
    );
  };
  
  export default Login;