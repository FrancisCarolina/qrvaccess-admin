import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deslogar, verificaSeLogado } from '../utils/auth';
import { Dropdown } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const HomePage = () => {
    const navigate = useNavigate();
    const [notifications,] = React.useState(1);

    React.useEffect(() => {
        if (!verificaSeLogado()) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        deslogar();
        navigate('/login');
    };
    const handleNotificationsClick = () => {
        // Lógica para mostrar as notificações
        alert('Aqui estão suas notificações');
    };
    const handleViewProfile = () => {
        // Redireciona para a página de dados pessoais
        navigate('/perfil');
    };

    return (
        verificaSeLogado() ? (
            <div className="home-page">
                <header className="navbar navbar-light bg-light shadow-sm p-3 mb-5">
                    <div className="navbar-left">
                        <h2>Home </h2>
                    </div>
                    <div className="navbar-right d-flex align-items-center">
                        <button onClick={handleNotificationsClick} className="btn btn-link">
                            <FaBell size={24} />
                            {notifications > 0 && <span className="badge bg-danger">{notifications}</span>}
                        </button>

                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" id="dropdown-profile">
                                <FaUserCircle size={24} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleViewProfile}>Ver Perfil</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Deslogar</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header>
                <section className="drivers-section mt-4">
                    HOME
                </section>
            </div>
        ) : null
    );

};

export default HomePage;
