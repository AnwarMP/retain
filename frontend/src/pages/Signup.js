import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Signup.css';
import '../Styles/Universal.css';

const Signup = () => {
    return (
      <body>
        <div className='nav-bar'>
            <Link to='/'><div className='logo'>Ret<span className="gradient-text">ai</span>n</div></Link>
            <ul>
                <li><Link to="/signup" className='nav-button'>Sign up</Link></li>
                <li><Link to="/login" className='nav-button'>Log in</Link></li>
            </ul>
        </div>
      </body>
    );
  };
  
  export default Signup;