import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormInput from '../Inputs/FormInput';
import PasswordInput from '../Inputs/PasswordInput';

const DriverForm = ({ onDriverCreated }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');

    const handleCpfChange = (event) => {
        const inputValue = event.target.value.replace(/\D/g, '');
        const formattedCpf = inputValue
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
            .slice(0, 14);
        setCpf(formattedCpf);
    };

    useEffect(() => {
        if (name && cpf.length >= 11) {
            const cpfNumbers = cpf.replace(/\D/g, '');
            const newPassword = `${name.split(' ')[0]}${cpfNumbers.slice(0, 3)}${cpfNumbers.slice(-2)}`;
            setPassword(newPassword);
        }
    }, [name, cpf]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Aqui, você pode adicionar a lógica de criação do condutor na API.
            // Após o sucesso, chame o callback para exibir o modal
            if (onDriverCreated) {
                onDriverCreated();
            }
        } catch (error) {
            console.error('Erro ao criar condutor:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormInput
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <FormInput
                label="CPF"
                value={cpf}
                onChange={handleCpfChange}
                maxLength="14"
                placeholder="000.000.000-00"
            />
            <Form.Label>Senha</Form.Label>
            <PasswordInput value={password} disabled />
            <Button variant="primary" type="submit">
                Enviar
            </Button>
        </Form>
    );
};

export default DriverForm;
