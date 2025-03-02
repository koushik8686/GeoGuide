import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './user/pages/Dashboard';
import TripDetails from './user/pages/TripDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trip/:tripId" element={<TripDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
