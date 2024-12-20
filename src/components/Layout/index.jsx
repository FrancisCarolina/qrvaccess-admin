import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { deslogar, verificaSeLogado } from '../../utils/auth';
import { Dropdown, Nav } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { setUser } from '../../redux/userSlice';
import { logoutUser } from '../../redux/userSlice';
import { clearDrivers } from '../../redux/driverSlice';
import './styles.css'; // Arquivo CSS para estilos personalizados

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notifications] = React.useState(1);

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        console.log(user);

        if (!verificaSeLogado()) {
            navigate('/login');
        }
        if (!user) {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (token && userId) {
                const fetchUser = async () => {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/${userId}`, {
                            headers: { 'x-access-token': token },
                        });

                        const userData = response.data;

                        dispatch(setUser({ user: userData, token }));
                    } catch (error) {
                        console.error('Erro ao buscar o usuário:', error);
                    }
                };

                fetchUser();
            }
        }
    }, [navigate, dispatch, user]);

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(clearDrivers());

        deslogar();
        navigate('/login');
    };

    const handleNotificationsClick = () => {
        alert('Aqui estão suas notificações');
    };

    const handleViewProfile = () => {
        navigate('/perfil');
    };

    return (
        verificaSeLogado() ? (
            <div className="layout">
                <header className="navbar navbar-light bg-light shadow-sm p-3 mb-3 d-flex justify-content-between">
                    <div className="navbar-left">
                        <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            {user?.Local?.nome || 'Meu Local'}
                        </h2>
                    </div>
                    <Nav className="navbar-center d-flex">
                        <Nav.Link className="nav-item-hover" onClick={() => navigate('/condutores')}>Condutores</Nav.Link>
                        <Nav.Link className="nav-item-hover" onClick={() => navigate('/veiculos')}>Veículos</Nav.Link>
                        <Nav.Link className="nav-item-hover" onClick={() => navigate('/relatorios')}>Relatórios</Nav.Link>
                    </Nav>
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
                <main className='layout-content'>{children}</main>
            </div>
        ) : null
    );
};

export default Layout;
