import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateDriver, selectDrivers } from '../../redux/driverSlice';
import { FaUser, FaCog } from 'react-icons/fa';
import Layout from '../../components/Layout';
import MessageModal from '../../components/Modal';
import './styles.css';

const EditDriverPage = () => {
    const { idUser } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Acessando o estado do Redux
    const drivers = useSelector(selectDrivers);
    const driver = drivers.find((driver) => driver.idUser === Number(idUser));

    const [name, setName] = useState(driver?.nome || '');
    const [status, setStatus] = useState(driver?.ativo || true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const [editing, setEditing] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const cardEditRef = useRef(null);

    useEffect(() => {
        if (!driver) {
            const fetchDriver = async () => {
                const token = localStorage.getItem('authToken');
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/condutor/user/${idUser}`, {
                        headers: { 'x-access-token': token },
                    });
                    const { nome, ativo, id } = response.data;
                    dispatch(updateDriver({ id, updatedDriver: { nome, ativo, idUser: Number(idUser) } }));
                    setName(nome);
                    setStatus(ativo);
                } catch (error) {
                    console.error('Erro ao carregar os dados do condutor:', error);
                    setModalMessage('Erro ao carregar os dados do condutor.');
                    setModalType('error');
                    setShowModal(true);
                }
            };

            fetchDriver();
        } else {
            setName(driver.nome);
            setStatus(driver.ativo);
        }
    }, [idUser, driver, dispatch]);

    const handleSaveClick = async () => {
        const updatedDriver = { nome: inputValue || name, ativo: status };

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/condutor/${driver.id}`, updatedDriver, {
                headers: { 'x-access-token': token },
            });
            dispatch(updateDriver({ id: driver.id, updatedDriver }));
            setModalMessage('Condutor atualizado com sucesso.');
            setModalType('success');
            setShowModal(true);
            setEditing(null);
        } catch (error) {
            console.error('Erro ao atualizar condutor:', error);
            setModalMessage('Erro ao atualizar condutor.');
            setModalType('error');
            setShowModal(true);
        }
    };

    const handleEditClick = (section) => {
        setEditing(section);
        setInputValue(name);
    };

    const handleClickOutside = (event) => {
        if (cardEditRef.current && !cardEditRef.current.contains(event.target)) {
            setEditing(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        if (modalType === 'success') {
            navigate('/condutores');
        }
    };

    return (
        <Layout>
            <div className="container-perfil">
                <h2>Detalhamento do Condutor</h2>
                <section>
                    <div>Nome:</div>
                    <div>{name}</div>
                </section>
                <section>
                    <div>Status:</div>
                    <div>{driver?.ativo ? 'Ativo' : 'Inativo'}</div>
                </section>
                <div className="card-perfil">
                    {editing === 'nome' ? (
                        <div className="card-edit" ref={cardEditRef}>
                            <label htmlFor="nome">Novo nome do Condutor:</label>
                            <div className="edit-form">
                                <input
                                    id="nome"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Digite o novo nome"
                                />
                                <button onClick={handleSaveClick} className='edit-perfil-button'>Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" onClick={() => handleEditClick('nome')}>
                            <FaUser />
                            <div>Atualizar nome do Condutor</div>
                        </div>
                    )}
                    {editing === 'status' ? (
                        <div className="card-edit" ref={cardEditRef}>
                            <label>Alterar Status:</label>
                            <div className="edit-form radio-edit">
                                <div className='radio-containers'>
                                    <input
                                        type="radio"
                                        id="ativo"
                                        name="status"
                                        value={true}
                                        checked={status === true}
                                        onChange={() => setStatus(true)}
                                    />
                                    <label htmlFor="ativo">Ativo</label>
                                    <input
                                        type="radio"
                                        id="inativo"
                                        name="status"
                                        value={false}
                                        checked={status === false}
                                        onChange={() => setStatus(false)}
                                    />
                                    <label htmlFor="inativo">Inativo</label>
                                </div>
                                <button onClick={handleSaveClick} className='edit-perfil-button'>Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" onClick={() => handleEditClick('status')}>
                            <FaCog />
                            <div>Alterar Status</div>
                        </div>
                    )}
                </div>
                <button className="logout-button" onClick={() => navigate('/condutores')}>
                    Voltar
                </button>
            </div>

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
