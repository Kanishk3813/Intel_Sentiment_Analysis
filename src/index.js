import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/homepage';
import Analyze from './components/analyzer';
import PastTrends from './components/PastTrends';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/pasttrends" element={<PastTrends />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
