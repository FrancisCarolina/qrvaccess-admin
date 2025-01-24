import React, { useState } from 'react';
import PasswordInput from '../Inputs/PasswordInput'; // Importa o novo componente
// Adiciona o mesmo arquivo de estilos

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [local, setLocal] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(email, password, local);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Cadastrar</h1>
      <p>Informe seus dados para se cadastrar no sistema!</p>

      <div className="form-group">
        <label htmlFor="local" className="label">Local:</label>
        <input
          type="text"
          id="local"
          className="input"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />
      </div>

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

      <button type="submit" className="button">Cadastrar</button>
    </form>
  );
};

export default RegisterForm;
