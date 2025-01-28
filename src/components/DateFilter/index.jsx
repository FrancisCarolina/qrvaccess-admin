import React from 'react';
import { Form } from 'react-bootstrap';

const DateFilter = ({ selectedDate, currentDay, handleDateChange }) => {
    return (
        <Form.Group controlId="dateFilter" className="filtro-diario-semanal">
            <Form.Label className="form-label">Selecione a data</Form.Label>
            <Form.Control
                type="date"
                value={selectedDate}
                max={currentDay}
                onChange={handleDateChange}
                className="form-control"
            />
        </Form.Group>
    );
};

export default DateFilter;
