import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import VehicleCard from '../../components/Card/VehicleCard';
import './styles.css';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem('authToken');

            if (token && user && user.Local && user.Local.id) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/veiculo/local/${user.Local.id}`, {
                        headers: { 'x-access-token': token },
                    });
                    console.log("RESPONSE: ", response.data);

                    setVehicles(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar veículos:', error);
                    setLoading(false);
                }
            } else {
                console.error('Usuário ou token não encontrado.');
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [user]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Layout>
            <h2 className='mb-4'>Meus Veículos</h2>
            <div className="cards-scroll-container">
                <div className="vehicle-cards-container">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default VehiclesPage;
