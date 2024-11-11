// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import DriversPage from './pages/Drivers';
import NewDriversPage from './pages/NewDriver';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/condutores" element={<DriversPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/novoCondutor" element={<NewDriversPage />} />
      </Routes>
    </Router>
  );
};

export default App;
