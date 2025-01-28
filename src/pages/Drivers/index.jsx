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
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);
    const drivers = useSelector(selectDrivers);

    useEffect(() => {
        const fetchDrivers = async () => {
            const token = localStorage.getItem('authToken');

            if (token && user && user.Local && user.Local.id) {
                try {
                    if (drivers.length === 0) {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/condutor/local/${user.Local.id}`, {
                            headers: { 'x-access-token': token },
                        });
                        console.log("RESPONSE: ", response.data);

                        dispatch(setDrivers(response.data));
                    }
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
    }, [user, drivers, dispatch]);

    const handleEdit = (driverId) => {
        navigate(`/condutores/${driverId}/editar`);
    };

    const handleCreateDriver = () => {
        navigate("/novoCondutor");
    };

    if (loading) {
        return <Layout><Loader></Loader></Layout>;
    }

    return (
        <Layout>
            <div className="container-novo-condutor">
                <h1>Meus Condutores</h1>
                <p>Controle os condutores dos veículos que acessam seu local regularmente</p>

                <div>
                    <input type="text" placeholder="Busque pelo Condutor pelo Nome ou CPF" />
                    <button className="novo-condutor" onClick={handleCreateDriver}>
                        <div>
                            Novo Condutor
                            <FaPlus size={20} style={{ marginLeft: '8px' }} />
                        </div>
                    </button>
                </div>

                {/* Verificando se há condutores */}
                {drivers.length === 0 ? (
                    <div className="no-drivers-message">
                        Nenhum condutor encontrado. Adicione um novo condutor.
                    </div>
                ) : (
                    <div className='condutores-scroll'>
                        <section className="condutores-cards">
                            {drivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}{drivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}{drivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}{drivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}{drivers.map((driver) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    onEdit={handleEdit}
                                />
                            ))}{drivers.map((driver) => (
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