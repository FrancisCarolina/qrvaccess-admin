import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  // Para garantir que a senha não fique visível após o mouse ser solto,
  // mesmo que o botão de mouse não seja solto.
  const handleMouseLeave = () => {
    setShowPassword(false);
  };

  return (
    <div className="input-group mb-3">
      <input
        type={showPassword ? 'text' : 'password'}
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onMouseDown={handleMouseDown} 
        onMouseUp={handleMouseUp}       
        onMouseLeave={handleMouseLeave} 
      >
        {showPassword ? <FaEye />: <FaEyeSlash />}
      </button>
    </div>
  );
};

export default PasswordInput;
