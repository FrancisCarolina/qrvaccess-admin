import React, { useState } from 'react';
import PasswordInput from '../Inputs/PasswordInput';
import { Link } from 'react-router-dom'; // Importa o componente

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 w-25 mx-auto">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Senha:</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">Entrar</button>

      <div className="mt-3 text-center">
        <p>Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link></p>
      </div>

    </form>
  );
};

export default LoginForm;
