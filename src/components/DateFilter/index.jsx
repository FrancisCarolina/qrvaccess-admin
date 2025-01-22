import React from 'react';
import { Form } from 'react-bootstrap';

const DateFilter = ({ selectedDate, currentDay, handleDateChange }) => {
    return (
        <Form.Group controlId="dateFilter">
            <Form.Label>Selecione a data</Form.Label>
            <Form.Control
                type="date"
                value={selectedDate}
                max={currentDay}
                onChange={handleDateChange}
            />
        </Form.Group>
    );
};

export default DateFilter;
