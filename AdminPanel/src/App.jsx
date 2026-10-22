import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/AdminDashboard';
import AdminGyms from './components/AdminGyms'; 
import GymDetails from './components/GymDetails';
import AdminTrainers from './components/AdminTrainers';
import AdminSupplements from './components/AdminSupplements';
import AdminReports from './components/AdminReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gyms" element={<AdminGyms />} />
        <Route path="/gym-details/:id" element={<GymDetails />} />
        <Route path="/trainers" element={<AdminTrainers />} />
        <Route path="/supplements" element={<AdminSupplements />} />
        <Route path="/reports" element={<AdminReports />} />
      </Routes>
    </Router>
  );
}

export default App;