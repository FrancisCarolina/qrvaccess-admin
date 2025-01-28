import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MessageModal from '../../Modal';
import './styles.css';
import PasswordInput from '../../Inputs/PasswordInput';

const DriverForm = () => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const user = useSelector((state) => state.user.user);

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
            setModalMessage(
                'A senha foi criada automaticamente com o primeiro nome e os três primeiros e dois últimos dígitos do CPF. Informe essa regra ao condutor.'
            );
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
        <div className="novo-driver">
            <h1>Novo Condutor</h1>
            <div className="container-driver-novo">
                <h3>Dados Cadastrais</h3>
                <div className="content-novo-driver">
                    <div className="card-novo-driver">
                        <form onSubmit={handleSubmit}>
                            <div className="form-input-driver">
                                <label>Nome do Condutor:</label>
                                <input
                                    type="text"
                                    placeholder="Nome Completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-input-driver">
                                <label>CPF:</label>
                                <input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    maxLength="14"
                                />
                            </div>
                            <div className="form-input-driver">
                                <label>Senha:</label>
                                <PasswordInput
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled
                                />
                            </div>
                            <div className="container-botoes">
                                <button type="button" className="btn-secondary" onClick={() => setName('')}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="descricao">
                        <h4>Controle os condutores que usam seu local de modo mais eficiente!</h4>
                        <div className="imagem-novo-driver">
                            <img src="/QR_VAccess.png" alt="QR-VAccess" className="logo-img-driver" />
                        </div>
                    </div>
                </div>
            </div>

            <MessageModal
                showModal={showModal}
                handleClose={handleCloseModal}
                title={modalType === 'success' ? 'Senha Gerada Automaticamente' : 'Erro'}
                message={modalMessage}
                type={modalType}
            />
        </div>
    );
};

export default DriverForm;
