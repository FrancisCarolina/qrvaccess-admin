import React from 'react';
import './styles.css';

const DriverCard = ({ driver, onEdit }) => {
    const status = driver.ativo ? 'Ativo' : 'Inativo';
    const formatCPF = (cpf) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };
    return (
        <div className="card-condutores" onClick={() => onEdit(driver.Usuario?.id)}>
            <div className="card-titulo">
                <span>{status}</span>
                <h2>{driver.nome}</h2>
            </div>
            <div className="condutor-content">
                <div>
                    <p>CPF:</p>
                    <p>{formatCPF(driver.cpf)}</p>
                </div>
                <div>
                    <p>Login:</p>
                    <p>{driver.Usuario?.login}</p>
                </div>
            </div>

            <button className="card-condutor-button">Visualizar Condutor</button>
        </div>
    );
};

export default DriverCard;
