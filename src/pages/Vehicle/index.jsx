import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import VehicleCard from '../../components/Card/VehicleCard';
import './styles.css';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(""); // Estado para o campo de busca

    const user = useSelector((state) => state.user.user);

    const fetchVehicles = async (query = "") => {
        const token = localStorage.getItem('authToken');
        if (token && user && user.Local && user.Local.id) {
            try {
                const url = query
                    ? `${process.env.REACT_APP_API_URL}/busca/veiculo/local/${user.Local.id}`
                    : `${process.env.REACT_APP_API_URL}/veiculo/local/${user.Local.id}`;

                const params = query ? { busca: query } : null;

                const response = await axios.get(url, {
                    headers: { 'x-access-token': token },
                    params, // Passa os parâmetros apenas se houver busca
                });
                setVehicles(response.data);
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
                setVehicles([]); // Reseta a lista caso haja erro
            } finally {
                setLoading(false);
            }
        } else {
            console.error('Usuário ou token não encontrado.');
            setLoading(false);
        }
    };

    // Busca inicial
    useEffect(() => {
        fetchVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Manipulador para o campo de busca
    const handleSearchChange = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearch(query);
        fetchVehicles(query);
        setLoading(false); // Atualiza a busca com o texto digitado
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Layout>
            <h2 className='mb-4'>Gerenciamento de Veículos</h2>
            <input
                type="text"
                className="search-input"
                placeholder="Busque por placa ou nome do condutor..."
                value={search}
                onChange={handleSearchChange}
            />
            {vehicles.length === 0 ? (
                <div className="no-vehicles-message">Nenhum veículo encontrado.</div>
            ) : (
                <div className="cards-scroll-container">
                    <div className="vehicle-cards-container">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default VehiclesPage;
