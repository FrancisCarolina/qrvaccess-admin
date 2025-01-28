import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setDrivers, selectDrivers } from '../../redux/driverSlice';
import Layout from '../../components/Layout';
import DriverCard from '../../components/Card/DriverCard';
import './styles.css';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const DriversPage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);
    const drivers = useSelector(selectDrivers);

    useEffect(() => {
        const fetchDrivers = async () => {
            const token = localStorage.getItem('authToken');

            if (token && user && user.Local && user.Local.id) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/condutor/local/${user.Local.id}`, {
                        headers: { 'x-access-token': token },
                    });
                    dispatch(setDrivers(response.data));
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar condutores:', error);
                    setLoading(false);
                }
            } else {
                console.error('Usuário ou token não encontrado.');
                setLoading(false);
            }
        };

        fetchDrivers();
    }, [user, dispatch]);

    const handleEdit = (driverId) => {
        navigate(`/condutores/${driverId}/editar`);
    };

    const handleCreateDriver = () => {
        navigate("/novoCondutor");
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.cpf.includes(searchTerm)
    );

    if (loading) {
        return <Layout><Loader></Loader></Layout>;
    }

    return (
        <Layout>
            <div className="container-novo-condutor">
                <h1>Meus Condutores</h1>
                <p>Controle os condutores dos veículos que acessam seu local regularmente</p>

                <div>
                    <input
                        type="text"
                        placeholder="Busque pelo Condutor pelo Nome ou CPF"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="novo-condutor" onClick={handleCreateDriver}>
                        <div>
                            Novo Condutor
                            <FaPlus size={20} style={{ marginLeft: '8px' }} />
                        </div>
                    </button>
                </div>

                {filteredDrivers.length === 0 ? (
                    <div className="no-drivers-message">
                        Nenhum condutor encontrado.
                    </div>
                ) : (
                    <div className='condutores-scroll'>
                        <section className="condutores-cards">
                            {filteredDrivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </section>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default DriversPage;
