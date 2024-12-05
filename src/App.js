// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import DriversPage from './pages/Drivers';
import NewDriversPage from './pages/NewDriver';
import VehiclesPage from './pages/Vehicle';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/novoCondutor" element={<NewDriversPage />} />
        <Route path="/condutores" element={<DriversPage />} />
        <Route path="/veiculos" element={<VehiclesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
