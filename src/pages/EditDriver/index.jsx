import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import FormInput from '../../components/Inputs/FormInput';
import MessageModal from '../../components/Modal';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { updateDriver } from '../../redux/driverSlice';

const EditDriverPage = () => {
    const { idUser } = useParams(); // Captura o ID do condutor da URL
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [status, setStatus] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const [idCondutor, setIdCondutor] = useState();

    useEffect(() => {
        const fetchDriver = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/condutor/user/${idUser}`, {
                    headers: { 'x-access-token': token },
                });
                const { nome, ativo, id } = response.data;
                setName(nome);
                setStatus(ativo);
                setIdCondutor(id);
            } catch (error) {
                console.error('Erro ao carregar os dados do condutor:', error);
                setModalMessage('Erro ao carregar os dados do condutor.');
                setModalType('error');
                setShowModal(true);
            }
        };

        fetchDriver();
    }, [idUser, dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedDriver = { nome: name, ativo: status };

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/condutor/${idCondutor}`, updatedDriver, {
                headers: { 'x-access-token': token },
            });
            dispatch(updateDriver({ id: idCondutor, updatedDriver }));
            setModalMessage('Condutor atualizado com sucesso.');
            setModalType('success');
            setShowModal(true);
        } catch (error) {
            console.error('Erro ao atualizar condutor:', error);
            let errorMessage = 'Erro ao atualizar condutor.';
            if (error.response && error.response.status === 404) {
                errorMessage = 'Condutor não encontrado.';
            }
            setModalMessage(errorMessage);
            setModalType('error');
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (modalType === 'success') {
            navigate('/condutores'); // Redireciona após sucesso
        }
    };

    return (
        <Layout>
            <h2>Editar Condutor</h2>
            <Form onSubmit={handleSubmit}>
                <FormInput
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                        type="radio"
                        label="Ativo"
                        name="status"
                        checked={status === true}
                        onChange={() => setStatus(true)}
                    />
                    <Form.Check
                        type="radio"
                        label="Inativo"
                        name="status"
                        checked={status === false}
                        onChange={() => setStatus(false)}
                    />
                </Form.Group>
                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate('/condutores')}>
                        Voltar
                    </Button>
                    <Button variant="primary" type="submit">
                        Atualizar
                    </Button>
                </div>
            </Form>

            <MessageModal
                showModal={showModal}
                handleClose={handleCloseModal}
                title={modalType === 'success' ? 'Sucesso' : 'Erro'}
                message={modalMessage}
                type={modalType}
            />
        </Layout>
    );
};

export default EditDriverPage;
