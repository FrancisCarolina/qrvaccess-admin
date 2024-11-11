import React from 'react';
import { Form } from 'react-bootstrap';

const FormInput = ({ label, type = 'text', value, onChange, disabled = false, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
        />
    </Form.Group>
);

export default FormInput;
