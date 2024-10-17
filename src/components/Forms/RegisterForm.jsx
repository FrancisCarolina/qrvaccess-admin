import React, { useState } from 'react';
import PasswordInput from '../Inputs/PasswordInput'; // Importa o novo componente

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [local, setLocal] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(email, password, local);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 w-25 mx-auto">
      <div className="mb-3">
        <label htmlFor="local" className="form-label">Local:</label>
        <input
          type="text"
          className="form-control"
          id="local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />
      </div>

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

      <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
    </form>
  );
};

export default RegisterForm;
