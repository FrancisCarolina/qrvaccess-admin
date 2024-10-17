import React, { useState } from 'react';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [local, setLocal] = useState('');  // Novo estado para o campo local

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(email, password, local);  // Inclui o local na função de registro
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
        <input
          type="password"
          className="form-control"
          id="password"
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
