import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Header from './components/Header'

function App() {
  return (
    <Router>
      {/* <Header>

      </Header> */}
      <div className="App">
        <Routes>
          {/* Route for the Landing Page */}
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
