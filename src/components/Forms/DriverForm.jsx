import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import FormInput from '../Inputs/FormInput';
import PasswordInput from '../Inputs/PasswordInput';
import MessageModal from '../Modal';

const DriverForm = () => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const user = useSelector((state) => state.user.user); // Obtendo o local_id do Redux

    const handleCpfChange = (event) => {
        const inputValue = event.target.value.replace(/\D/g, ''); // Apenas números
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
        const cpfNumbers = cpf.replace(/\D/g, '');

        const newDriver = {
            nome: name,
            cpf: cpfNumbers,
            local_id: user?.Local?.id,
            login: cpfNumbers,
            senha: password,
        };

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/condutor`, newDriver, {
                headers: { 'x-access-token': token },
            });
            setModalMessage('A senha foi criada automaticamente com o primeiro nome e os três primeiros e dois últimos dígitos do CPF.Informe essa regra ao condutor.');
            setModalType('success');
            setShowModal(true);
            setName('');
            setCpf('');
            setPassword('');
        } catch (error) {
            console.error('Erro ao criar condutor:', error);
            let errorMessage = 'Erro ao criar condutor.';
            if (error.response && error.response.status === 409) {
                errorMessage = 'O CPF já está em uso.';
            }
            setModalMessage(errorMessage);
            setModalType('error');
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
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
                <PasswordInput value={password} disabled />
                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>

            <MessageModal
                showModal={showModal}
                handleClose={handleCloseModal}
                title={modalType === 'success' ? 'Senha Gerada Automaticamente' : 'Erro'}
                message={modalMessage}
                type={modalType}
            />
        </>
    );
};

export default DriverForm;
