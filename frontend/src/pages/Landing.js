import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Landing.css';
import '../Styles/Universal.css';
import TextToSpeech from '../components/TextToSpeech';

// const Landing = () => {
//     return (
//       <body>
//         <div className='nav-bar'>
//             <Link to='/'><div className='logo'>Ret<span className="gradient-text">ai</span>n</div></Link>
//             <ul>
//                 <li><Link to="/signup" className='nav-button'>Sign up</Link></li>
//                 <li><Link to="/login" className='nav-button'>Log in</Link></li>
//             </ul>
//         </div>
//         <div className="introduction">
//           <div className="header">Ret<span className="gradient-text-animate">ai</span>n More, <br /> Achieve More</div>
//           <div className="text"> Your personalized lecturer: Tailored to guide you through the most critical concepts, <br></br>making learning faster and more engaging. </div>
//           <Link to="/login">
//             <button>Try Retain</button>
//           </Link>
//         </div>
//         {/* <TextToSpeech></TextToSpeech> */}
//       </body>
//     );
//   };

const Landing = () => {
  return (
    <div className="border-gray-200 px-2 m-5">
      <nav className="flex justify-between items-center w-full h-16 bg-white px-8">
        <Link to='/' className="text-black text-2xl font-extrabold">Ret<span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent font-bold">ai</span>n</Link>
        <ul className="flex space-x-10">
          <li><Link to="/signup" className='text-black'>Sign up</Link></li>
          <li><Link to="/login" className='text-black'>Log in</Link></li>
        </ul>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-7xl font-semibold tracking-wide mt-24">Ret<span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent animate-pulse">ai</span>n More,<br /> Achieve More</h1>
        <p className="mt-10 text-lg text-gray-600 leading-relaxed">Your personalized lecturer: Tailored to guide you through the most critical concepts, making learning faster and more engaging.</p>
        <Link to="/login">
          <button className="m-12 p-6 h-14 text-2xl text-white flex justify-center items-center bg-black rounded-lg transition-colors duration-300 hover:bg-gray-800">
            Try Retain
          </button>
        </Link>
      </div>
      {/* <TextToSpeech /> */}
    </div>
  );
};

export default Landing;