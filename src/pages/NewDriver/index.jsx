import React, { useState } from 'react';
import Layout from '../../components/Layout';
import DriverForm from '../../components/Forms/DriverForm';
import MessageModal from '../../components/Modal';

const NewDriversPage = () => {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);

    const handleShowPasswordMessage = () => {
        setShowModal(true);
    };

    return (
        <Layout>
            <DriverForm onDriverCreated={handleShowPasswordMessage} />

            <MessageModal
                showModal={showModal}
                handleClose={handleCloseModal}
                title="Senha Gerada Automaticamente"
                message="A senha foi criada automaticamente com o primeiro nome e os três primeiros e dois últimos dígitos do CPF. Informe essa regra ao condutor."
                type="success"
            />
        </Layout>
    );
};

export default NewDriversPage;
