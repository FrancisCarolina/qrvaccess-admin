import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa o Link do React Router

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email, 'Password:', password);
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
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Login</button>
      
      {/* Link para a tela de cadastro */}
      <div className="mt-3 text-center">
        <p>Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link></p>
      </div>
    </form>
  );
};

export default LoginForm;
