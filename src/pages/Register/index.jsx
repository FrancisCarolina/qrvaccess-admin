import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/Forms/RegisterForm';
import axios from 'axios';
import { verificaSeLogado } from '../../utils/auth';
import MessageModal from '../../components/Modal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  React.useEffect(() => {
    if (verificaSeLogado()) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (email, password, local) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin`, {
        login: email,
        senha: password,
        nome_local: local,
      });

      setModalMessage(response.data);
      setModalType('success');
      setShowModal(true);

    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);

      let errorMessage = 'Erro ao registrar usuário.';
      if (error.response && error.response.status === 409) {
        errorMessage = 'Este Login já está em uso.';
      }
      setModalMessage(errorMessage);
      setModalType('error');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === 'success') {
      navigate("/login");
    }
  }
  return (
    !verificaSeLogado() ? (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <h2 className="mb-4">Cadastro</h2>
        <RegisterForm onRegister={handleRegister} />

        <div className="mt-3 text-center">
          <p>Já tem uma conta? <Link to="/login">Faça login aqui</Link></p>
        </div>

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

export default RegisterPage;
