import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/homepage'; // Make sure this component exists
import Analyze from './components/analyzer'; // Make sure this component exists

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
