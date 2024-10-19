import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Landing.css';
import '../Styles/Universal.css';

const Landing = () => {
    return (
      <body>
        <div className='nav-bar'>
            <div className='logo'>Ret<span className="gradient-text">ai</span>n</div>
            <ul>
                <li><Link to="/login" className='nav-button'>Sign up</Link></li>
                <li><Link to="/signup" className='nav-button'>Log in</Link></li>
            </ul>
        </div>
        <div className="introduction">
          <div className="header">Ret<span className="gradient-text-animate">ai</span>n More, <br /> Achieve More</div>
          <div className="text"> Your personalized lecturer: Tailored to guide you through the most critical concepts, <br></br>making learning faster and more engaging. </div>
          <button> Try Retain </button>
        </div>
      </body>
    );
  };
  
  export default Landing;