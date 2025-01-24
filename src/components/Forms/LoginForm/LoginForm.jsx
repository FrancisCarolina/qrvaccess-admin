import React, { useState } from 'react';
import PasswordInput from '../../Inputs/PasswordInput';
import { Link } from 'react-router-dom'; // Importa o componente
import './styles.css'

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>
      <p>Entre com seu login e senha!</p>

      <div className="form-group">
        <label htmlFor="email" className="label">E-mail:</label>
        <input
          type="email"
          id="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="label">Senha:</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="button">Entrar</button>

      <div className="register">
        <p>Não tem uma conta? <Link to="/register" className="link">Cadastre-se aqui</Link></p>
      </div>
    </form>
  );
};

export default LoginForm;
