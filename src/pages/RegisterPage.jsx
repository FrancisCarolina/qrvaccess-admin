// RegisterPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Forms/RegisterForm';
import axios from 'axios';

const RegisterPage = () => {
  const handleRegister = async (email, password, local) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin`, {
        login: email,
        senha: password,
        nome_local: local,
      });
      console.log('Cadastro realizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);
    }
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
