import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../redux/userSlice';
import Layout from '../../components/Layout';
import './styles.css';
import { FaEnvelope, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

const Perfil = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({
        login: '',
        role_id: '',
        senha: '',
        local: {
            id: '',
            nome: ''
        }
    });
    const navigate = useNavigate();
    const cardEditRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                login: user.login,
                role_id: user.role_id,
                senha: '',
                local: {
                    id: user.Local?.id || '',
                    nome: user.Local?.nome || ''
                }
            });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('local.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                local: {
                    ...prev.local,
                    [key]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveChanges = async () => {
        const updatedUser = {
            login: formData.login,
            senha: formData.senha,
            nome_local: formData.local.nome
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/usuario/${user.id}`, updatedUser, {
                headers: { 'x-access-token': token }
            });

            dispatch(setUser({ user: response.data }));
            setEditingField(null);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            alert('Ocorreu um erro ao atualizar o perfil. Tente novamente.');
        }
    };

    useEffect(() => {
        const handleCancelEdit = () => {
            setEditingField(null);
            setFormData({
                login: user.login,
                role_id: user.role_id,
                senha: '',
                local: {
                    id: user.Local?.id || '',
                    nome: user.Local?.nome || ''
                }
            });
        };
        const handleClickOutside = (event) => {
            if (cardEditRef.current && !cardEditRef.current.contains(event.target)) {
                handleCancelEdit();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user]);

    return (
        <Layout>
            <div className="container-perfil">
                <h2>Perfil do Administrador do {user?.Local?.nome}</h2>
                <section>
                    <div>Login:</div>
                    <div>{user?.login}</div>
                </section>
                <section>
                    <div>Função:</div>
                    <div>{user?.role_id === 1 ? "Administrador" : "Condutor"}</div>
                </section>
                <section>
                    <div>Local:</div>
                    <div>{user?.Local?.nome}</div>
                </section>
                <div className="card-perfil">
                    {editingField === 'login' ? (
                        <div className="card-edit" ref={cardEditRef}>
                            <label htmlFor="login">Novo login:</label>
                            <div className="edit-form">
                                <input
                                    id="login"
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    placeholder="Digite o novo login"
                                />
                                <button onClick={handleSaveChanges}>Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" onClick={() => setEditingField('login')}>
                            <FaEnvelope />
                            <div>Atualizar Login</div>
                        </div>
                    )}
                    {editingField === 'senha' ? (
                        <div className="card-edit" ref={cardEditRef}>
                            <label htmlFor="senha">Nova senha:</label>
                            <div className="edit-form">
                                <input
                                    id="senha"
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="Digite a nova senha"
                                />
                                <button onClick={handleSaveChanges}>Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" onClick={() => setEditingField('senha')}>
                            <FaLock />
                            <div>Alterar Senha</div>
                        </div>
                    )}
                    {editingField === 'local' ? (
                        <div className="card-edit" ref={cardEditRef}>
                            <label htmlFor="local">Novo nome do local:</label>
                            <div className="edit-form">
                                <input
                                    id="local"
                                    type="text"
                                    name="local.nome"
                                    value={formData.local.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o novo nome do local"
                                />
                                <button onClick={handleSaveChanges}>Salvar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" onClick={() => setEditingField('local')}>
                            <FaMapMarkerAlt />
                            <div>Alterar Nome do Local</div>
                        </div>
                    )}
                </div>
                <button className="logout-button">Logout</button>
            </div>
        </Layout>
    );
};

export default Perfil;
