import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage';
import AnalyzerPage from './components/analyzer';
import PastTrends from './components/PastTrends';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzerPage />} />
        <Route path="/pasttrends" element={<PastTrends />} />
      </Routes>
    </Router>
  );
}

export default App;
