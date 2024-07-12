import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import VoterDashboard from './components/VoterDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import VoterVerification from './components/VoterVerification';
import Result from './components/Result';
import LoginPage from './components/LoginPage';
import MotionIntro from './components/MotionIntro';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MotionIntro />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/voterverification" element={<VoterVerification />} />
        <Route path="/voter" element={<VoterDashboard />} />
        <Route path="/result" element={<Result />} />
        <Route
          path="/organizer"
          element={
            isAuthenticated ? <OrganizerDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
