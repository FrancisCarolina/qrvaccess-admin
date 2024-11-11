import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import './styles.css';

const DriverCard = ({ driver, onEdit }) => {
    return (
        <Card className="driver-card mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>Nome: {driver.nome}</Card.Title>
                <Card.Text>CPF: {driver.cpf}</Card.Text>
                <Card.Text>Login: {driver.Usuario.login}</Card.Text>
                <div className="d-flex justify-content-between">
                    <Card.Text>
                        Status: {driver.ativo ? 'Ativo' : 'Inativo'}
                    </Card.Text>
                    <Button variant="outline-primary" onClick={() => onEdit(driver.id)} className="d-flex align-items-center">
                        <FaEdit className="me-2" />
                        Editar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DriverCard;
