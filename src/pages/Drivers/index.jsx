import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setDrivers, selectDrivers } from '../../redux/driverSlice';
import Layout from '../../components/Layout';
import DriverCard from '../../components/Card/DriverCard';
import './styles.css';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const DriversPage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

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
        console.log(`Editar condutor com ID: ${driverId}`);
    };

    const handleCreateDriver = () => {
        console.log("Criar novo condutor");
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Layout>
            <h2 className='mb-4'>Meus Condutores</h2>
            <div className="cards-scroll-container">
                <div className="driver-cards-container">
                    {drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} onEdit={handleEdit} />
                    ))}{drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} onEdit={handleEdit} />
                    ))}{drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} onEdit={handleEdit} />
                    ))}{drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} onEdit={handleEdit} />
                    ))}{drivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} onEdit={handleEdit} />
                    ))}
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <Button
                    variant="primary"
                    onClick={handleCreateDriver}
                    className="btn-floating"
                >
                    <div className='d-flex justify-content-between align-items-center'>
                        Novo Condutor
                        <FaPlus size={20} style={{ marginLeft: '8px' }} />
                    </div>
                </Button>
            </div>
        </Layout>
    );
};

export default DriversPage;
