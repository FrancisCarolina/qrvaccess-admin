import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../redux/userSlice';
import Layout from '../../components/Layout';

const Perfil = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        role_id: '',
        senha: '',
        confirmPassword: '',
        local: {
            id: '',
            nome: ''
        }
    });

    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                login: user.login,
                role_id: user.role_id,
                senha: '',
                confirmPassword: '',
                local: {
                    id: user.Local?.id || '',
                    nome: user.Local?.nome || ''
                }
            });
        }
    }, [user, navigate]);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

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
        if (formData.senha !== formData.confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }

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

            setIsEditing(false);
            setPasswordError('');
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            alert('Ocorreu um erro ao atualizar o perfil. Tente novamente.');
        }
    };

    const handleCancelEdit = () => {
        // Cancela as edições, restaurando os dados do usuário
        setIsEditing(false);
        setFormData({
            login: user.login,
            role_id: user.role_id,
            senha: '',
            confirmPassword: '',
            local: {
                id: user.Local?.id || '',
                nome: user.Local?.nome || ''
            }
        });
        setPasswordError('');
    };

    return (
        <Layout>
            <h2>Perfil de {user?.login}</h2>
            <div className="perfil-info">
                {isEditing ? (
                    <>
                        <div className="form-group">
                            <label>Login</label>
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        {passwordError && <div className="text-danger">{passwordError}</div>}
                        <div className="form-group">
                            <label>Local</label>
                            <input
                                type="text"
                                name="local.nome"
                                value={formData.local.nome}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <button className="btn btn-primary mt-3" style={{ marginRight: "20px" }} onClick={handleSaveChanges}>Salvar alterações</button>
                        <button className="btn btn-secondary mt-3" onClick={handleCancelEdit}>Cancelar</button>
                    </>
                ) : (
                    <>
                        <p><strong>Login:</strong> {user?.login}</p>
                        <p><strong>Função:</strong> {user?.role_id}</p>
                        <p><strong>Local:</strong> {user?.Local?.nome}</p>
                        <button className="btn btn-warning" onClick={handleEditProfile}>Editar Login</button>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Perfil;
