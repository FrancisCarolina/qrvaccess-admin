import React, { useEffect } from 'react';
import './styles.css';
import { Card } from 'react-bootstrap';

const VehicleCard = ({ vehicle }) => {
    useEffect(() => {
        console.log("VEICULOS: ", vehicle);

    }, [vehicle])
    return (
        <Card className="vehicle-card mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>{vehicle.modelo} - {vehicle.Condutor?.nome}</Card.Title>
                <Card.Text>Placa: {vehicle.placa}</Card.Text>
                <Card.Text>Marca: {vehicle.marca}</Card.Text>
                <Card.Text>Cor: {vehicle.cor}</Card.Text>
                <Card.Text>Ano: {vehicle.ano}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default VehicleCard;
