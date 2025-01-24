import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { deslogar, verificaSeLogado } from '../../utils/auth';
import { FaCar, FaUser, FaClipboardList, FaAngleRight, FaAngleLeft, FaUserCircle } from 'react-icons/fa';
import { setUser } from '../../redux/userSlice';
import { logoutUser } from '../../redux/userSlice';
import { clearDrivers } from '../../redux/driverSlice';
import Dropdown from 'react-bootstrap/Dropdown';
import './styles.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
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

    const toggleMenu = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(clearDrivers());

        deslogar();
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/perfil');
    };

    return (
        verificaSeLogado() ? (
            <div className="container-layout">
                {/* Menu Lateral */}
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className='imagem-layout'>
                        <img src="/QR_VAccess.png" alt="QR-VAccess" className="logo-img" />
                    </div>
                    <div className="sidebar-header">
                        <div className="sidebar-toggle" onClick={toggleMenu}>
                            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
                        </div>
                    </div>

                    <ul className="sidebar-menu">
                        <li className={collapsed ? 'li-center' : ''} onClick={() => navigate('/veiculos')}>
                            <FaCar />
                            {!collapsed && <span>Veículos</span>}
                        </li>
                        <li className={collapsed ? 'li-center' : ''} onClick={() => navigate('/condutores')}>
                            <FaUser />
                            {!collapsed && <span>Condutores</span>}
                        </li>
                        <li className={collapsed ? 'li-center' : ''} onClick={() => navigate('/relatorios')}>
                            <FaClipboardList />
                            {!collapsed && <span>Relatórios</span>}
                        </li>
                    </ul>
                </div>

                {/* Conteúdo Principal */}
                <div className="content-layout">
                    <div className="top-menu-layout">
                        <span>Administrador - {user?.Local?.nome || 'Meu Local'}</span>
                        <Dropdown drop="start">
                            <Dropdown.Toggle as={FaUserCircle} className="profile-icon" />
                            <Dropdown.Menu className="dropdown-menu-fixed">
                                <Dropdown.Item onClick={handleProfileClick}>Perfil</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Deslogar</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="principal-content">
                        {children}
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default Layout;
