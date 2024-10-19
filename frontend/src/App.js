import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Header from './components/Header'
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      {/* <Header>

      </Header> */}
      <div className="App">
        <Routes>
          {/* Route for the Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
