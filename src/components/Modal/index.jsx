import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MessageModal = ({ showModal, handleClose, title, message, type }) => {
    const modalClass = type === 'success' ? 'bg-success text-white' : 'bg-danger text-white';
    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton className={modalClass}>
                <Modal.Title>{icon} {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default MessageModal