import React from 'react';
import LoginForm from '../components/Forms/LoginForm';

const LoginPage = () => {
  const handleLogin = (email, password) => {
    console.log('Login Enviado:', { email, password });
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h2 className="mb-4">Login</h2>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
