import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './styles.css'; // Seu CSS customizado
import Layout from '../../components/Layout';
import { FaSearch } from "react-icons/fa";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Loader from '../../components/Loader';

const VehiclesPage = () => {
    const [vehiclesPresent, setVehiclesPresent] = useState([]);
    const [otherVehicles, setOtherVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [detailsVisible, setDetailsVisible] = useState({});

    const user = useSelector((state) => state.user.user);

    const fetchVehicles = async (query = "") => {
        const token = localStorage.getItem('authToken');
        if (token && user && user.Local && user.Local.id) {
            try {
                const vehicleUrl = query
                    ? `${process.env.REACT_APP_API_URL}/busca/veiculo/local/${user.Local.id}`
                    : `${process.env.REACT_APP_API_URL}/veiculo/local/${user.Local.id}`;

                const params = query ? { busca: query } : null;

                const vehicleResponse = await axios.get(vehicleUrl, {
                    headers: { 'x-access-token': token },
                    params,
                });

                const vehicles = vehicleResponse.data;
                const today = new Date().toISOString().split('T')[0];
                const historyUrl = `${process.env.REACT_APP_API_URL}/historico/local/${user.Local.id}`;
                const historyResponse = await axios.get(historyUrl, {
                    headers: { 'x-access-token': token },
                    params: { type: "daily", date: today },
                });

                const historyData = historyResponse.data;
                const presentVehicles = [];
                const otherVehicles = [];

                vehicles.forEach((vehicle) => {
                    const matchingHistory = historyData.find((entry) =>
                        entry.Condutor?.Veiculos?.some(
                            (v) => v.placa === vehicle.placa && v.Historicos?.some(h => h.data_saida === null)
                        )
                    );
                    if (matchingHistory) {
                        const historyEntry = matchingHistory?.Condutor?.Veiculos
                            ?.find(v => v.placa === vehicle.placa)
                            ?.Historicos?.find(h => h.data_saida === null);

                        presentVehicles.push({
                            ...vehicle,
                            entrada: {
                                data: historyEntry?.data_entrada || "Desconhecida",
                            },
                        });
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

    useEffect(() => {
        fetchVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleSearchChange = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearch(query);
        fetchVehicles(query);
        setLoading(false);
    };

    const toggleDetails = (id) => {
        setDetailsVisible((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) {
        return <Layout><Loader></Loader></Layout>;
    }

    return (
        <Layout>
            <div className="container-veiculos">
                <h1>Gerenciamento de Veículos</h1>
                <div className="busca-container">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Buscar por placa do veículo ou nome do condutor"
                            className="input-busca"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <FaSearch className="busca-icon" />
                    </div>
                </div>
                <div className='lista-veiculos'>
                    <h2 className="titulo-detalhes">Veículos Presentes</h2>
                    {!loading && vehiclesPresent.length === 0 && (
                        <p>Nenhum veículo estacionado encontrado.</p>
                    )}

                    {vehiclesPresent.length > 0 && (
                        <>
                            <div className="veiculos-presentes">
                                {vehiclesPresent.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="card-veiculo-detalhes estacionado"
                                    >
                                        <span>Estacionado</span>
                                        <div>
                                            <h2>{vehicle.modelo}</h2>
                                            <h1>{vehicle.Condutor?.nome}</h1>
                                        </div>
                                        <div className="detalhes-container">
                                            <div className="detalhes">
                                                <div className="detalhes-label">
                                                    <p><strong>Placa:</strong></p>
                                                    <p>{vehicle.placa}</p>
                                                </div>
                                                <div className="detalhes-label">
                                                    <p><strong>Cor:</strong></p>
                                                    <p>{vehicle.cor}</p>
                                                </div>
                                            </div>
                                            <div className="detalhes">
                                                <div className="detalhes-label">
                                                    <p><strong>Marca:</strong></p>
                                                    <p>{vehicle.marca}</p>
                                                </div>
                                                <div className="detalhes-label">
                                                    <p><strong>Ano:</strong></p>
                                                    <p>{vehicle.ano}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {detailsVisible[vehicle.id] && (
                                            <>
                                                <hr className="divisoria" />
                                                <div className="entrada-detalhes">
                                                    <h3>Detalhes da Entrada</h3>
                                                    <div className="detalhes">
                                                        <div className="detalhes-label">
                                                            <p><strong>Data:</strong></p>
                                                            <p>{format(new Date(vehicle.entrada.data), 'dd/MM/yyyy', { locale: ptBR })}</p>
                                                        </div>
                                                        <div className="detalhes-label">
                                                            <p><strong>Horário:</strong></p>
                                                            <p>{format(new Date(vehicle.entrada.data), 'HH:mm:ss', { locale: ptBR })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="button-container">
                                            <button onClick={() => toggleDetails(vehicle.id)}>
                                                {detailsVisible[vehicle.id] ? "Minimizar" : "Visualizar Mais"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <hr className="divisoria" />
                    <h2 className="titulo-detalhes">Outros Veículos</h2>
                    {!loading && otherVehicles.length === 0 && (
                        <p>Nenhum outro veículo encontrado.</p>
                    )}
                    {otherVehicles.length > 0 && (
                        <>
                            <div className="veiculos-outros">
                                {otherVehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="card-veiculo-detalhes nao-estacionado disabled"
                                    >
                                        <span>Fora do local</span>
                                        <div>
                                            <h2>{vehicle.modelo}</h2>
                                            <h1>{vehicle.Condutor?.nome}</h1>
                                        </div>
                                        <div className="detalhes-container">
                                            <div className="detalhes">
                                                <div className="detalhes-label">
                                                    <p><strong>Placa:</strong></p>
                                                    <p>{vehicle.placa}</p>
                                                </div>
                                                <div className="detalhes-label">
                                                    <p><strong>Cor:</strong></p>
                                                    <p>{vehicle.cor}</p>
                                                </div>
                                            </div>
                                            <div className="detalhes">
                                                <div className="detalhes-label">
                                                    <p><strong>Marca:</strong></p>
                                                    <p>{vehicle.marca}</p>
                                                </div>
                                                <div className="detalhes-label">
                                                    <p><strong>Ano:</strong></p>
                                                    <p>{vehicle.ano}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default VehiclesPage;
