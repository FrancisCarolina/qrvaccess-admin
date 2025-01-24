import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles.css'

const PasswordInput = ({ value, onChange, required, disabled = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDown = () => {
        setShowPassword(true);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
    };

    const handleMouseLeave = () => {
        setShowPassword(false);
    };

    return (
        <div className="input-container">
            <input
                type={showPassword ? 'text' : 'password'}
                className="input-password"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
            <button
                type="button"
                className="eye-button"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
    );
};

export default PasswordInput;
