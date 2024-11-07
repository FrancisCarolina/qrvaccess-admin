import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import axios from 'axios';
import { logar, verificaSeLogado } from '../utils/auth';
import MessageModal from '../components/Modal';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  React.useEffect(() => {
    if (verificaSeLogado()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        login: email,
        senha: password,
      });

      const { auth, token, id } = response.data;

      if (auth) {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/${id}`, {
          headers: { 'x-access-token': token },
        });

        const user = userResponse.data;

        if (user.role_id === 1) {
          logar(token);

          dispatch(setUser({ user, token }));

          navigate('/');
        } else {
          setModalMessage('Acesso negado: Usuário não é admin');
          setModalType('error');
          setShowModal(true);
        }
      } else {
        setModalMessage('Falha na autenticação');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setModalMessage('Erro ao realizar login. Verifique seu login e senha.');
      setModalType('error');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    !verificaSeLogado() ? (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <h2 className="mb-4">Login</h2>
        <LoginForm onLogin={handleLogin} />

        {/* Modal de mensagem */}
        <MessageModal
          showModal={showModal}
          handleClose={handleCloseModal}
          title={modalType === 'success' ? 'Sucesso' : 'Erro'}
          message={modalMessage}
          type={modalType}
        />
      </div>
    ) : null
  );
};

export default LoginPage;
