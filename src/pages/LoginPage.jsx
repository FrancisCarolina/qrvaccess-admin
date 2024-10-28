// LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import axios from 'axios';
import { logar, verificaSeLogado } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (verificaSeLogado()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        login: email,
        senha: password,
      });

      const { auth, token } = response.data;

      if (auth) {
        logar(token);
        navigate('/');
      } else {
        console.error('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  };

  return (
    !verificaSeLogado() ? (<div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h2 className="mb-4">Login</h2>
      <LoginForm onLogin={handleLogin} />
    </div>) : null
  );
};

export default LoginPage;
