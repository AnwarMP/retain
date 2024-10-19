import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Header from './components/Header'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Lecture from './pages/Lecture';
import Home from './pages/Home'; 
import Article from './pages/Article';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Lecture" element={<Lecture />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Article" element={<Article />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
