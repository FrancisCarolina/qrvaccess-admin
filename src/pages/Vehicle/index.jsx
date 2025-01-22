import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import VehicleCard from '../../components/Card/VehicleCard';
import './styles.css';

const VehiclesPage = () => {
    const [vehiclesPresent, setVehiclesPresent] = useState([]);
    const [otherVehicles, setOtherVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(""); // Estado para o campo de busca

    const user = useSelector((state) => state.user.user);

    const fetchVehicles = async (query = "") => {
        const token = localStorage.getItem('authToken');
        if (token && user && user.Local && user.Local.id) {
            try {
                // URL para buscar veículos
                const vehicleUrl = query
                    ? `${process.env.REACT_APP_API_URL}/busca/veiculo/local/${user.Local.id}`
                    : `${process.env.REACT_APP_API_URL}/veiculo/local/${user.Local.id}`;

                const params = query ? { busca: query } : null;

                const vehicleResponse = await axios.get(vehicleUrl, {
                    headers: { 'x-access-token': token },
                    params, // Passa os parâmetros apenas se houver busca
                });

                const vehicles = vehicleResponse.data;
                const today = new Date().toISOString().split('T')[0];
                // URL para buscar histórico
                const historyUrl = `${process.env.REACT_APP_API_URL}/historico/local/${user.Local.id}`;
                const historyResponse = await axios.get(historyUrl, {
                    headers: { 'x-access-token': token },
                    params: { type: "daily", date: today }, // Exemplo de filtro
                });

                const historyData = historyResponse.data;

                // Determine veículos presentes e outros
                const presentVehicles = [];
                const otherVehicles = [];

                vehicles.forEach((vehicle) => {
                    const matchingHistory = historyData.find((entry) =>
                        entry.Condutor?.Veiculos?.some(
                            (v) => v.placa === vehicle.placa && v.Historicos?.some(h => h.data_saida === null)
                        )
                    );
                    if (matchingHistory) {
                        presentVehicles.push(vehicle);
                    } else {
                        otherVehicles.push(vehicle);
                    }
                });

                setVehiclesPresent(presentVehicles);
                setOtherVehicles(otherVehicles);
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
                setVehiclesPresent([]);
                setOtherVehicles([]);
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
        setLoading(false);
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
            {vehiclesPresent.length === 0 && otherVehicles.length === 0 ? (
                <div className="no-vehicles-message">Nenhum veículo encontrado.</div>
            ) : (
                <div className="cards-scroll-container">
                    {vehiclesPresent.length > 0 && (
                        <>
                            <h3 className="section-title">Veículos Presentes</h3>
                            <div className="vehicle-cards-container">
                                {vehiclesPresent.map((vehicle) => (
                                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                                ))}
                            </div>
                        </>
                    )}
                    {otherVehicles.length > 0 && (
                        <>
                            {vehiclesPresent.length > 0 && <h3 className="section-title">Outros Veículos</h3>}
                            <div className="vehicle-cards-container">
                                {otherVehicles.map((vehicle) => (
                                    <VehicleCard key={vehicle.id} vehicle={vehicle} disabled={vehiclesPresent.length > 0} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default VehiclesPage;
