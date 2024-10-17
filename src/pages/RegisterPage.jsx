import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Forms/RegisterForm'

const RegisterPage = () => {
  
  const handleRegister = (email, password, local) => {
    console.log('Cadastro Enviado:', { email, password, local });
   
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h2 className="mb-4">Cadastro</h2>
      <RegisterForm onRegister={handleRegister} />

      <div className="mt-3 text-center">
        <p>Já tem uma conta? <Link to="/login">Faça login aqui</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
