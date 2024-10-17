import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h2 className="mb-4">Login</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
