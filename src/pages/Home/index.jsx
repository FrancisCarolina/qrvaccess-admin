import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Chart } from "react-google-charts";
import { FaUsers, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const HomePage = () => {
    const [data, setData] = useState([]);
    const quantidade = 10;
    const navigate = useNavigate();

    const fetchData = async () => {
        const today = new Date('January 25, 2025 00:00:00');
        const lastSunday = new Date(today.setDate(today.getDate() - today.getDay())); // Última segunda-feira
        const formattedDate = lastSunday.toISOString().split('T')[0];

        const token = localStorage.getItem('authToken'); // Recupera o token

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/historico/local/2?type=weekly&date=${formattedDate}`,
                {
                    headers: { 'x-access-token': token }, // Adiciona o cabeçalho
                }
            );
            console.log(`${process.env.REACT_APP_API_URL}/historico/local/2?type=weekly&date=${formattedDate}`);

            const historicos = response.data;
            let countsByDay = {}

            for (let index = 0; index < 7; index++) {
                const day = new Date(lastSunday);
                day.setDate(day.getDate() + index);
                console.log("Day: ", day);

                countsByDay = {
                    ...countsByDay,
                    [day.toLocaleDateString('pt-BR', { weekday: 'long' })]: 0
                }

            }


            historicos.forEach((item) => {
                item.Condutor?.Veiculos.forEach((veiculo) => {
                    veiculo.Historicos.forEach((historico) => {
                        const entrada = new Date(historico.data_entrada);
                        const dayName = entrada.toLocaleDateString('pt-BR', { weekday: 'long' });
                        console.log(dayName);

                        countsByDay[dayName] += 1;
                    });
                });
            });

            setData([
                ["Dia", "Quantidade"],
                ...Object.entries(countsByDay),
            ]);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        backgroundColor: "#3a353e",
        hAxis: {
            title: "Mês",
            titleTextStyle: { color: "#8665d4" },
            textStyle: { color: "#fff" },
        },
        vAxis: {
            minValue: 0,
            title: "Quantidade",
            titleTextStyle: { color: "#8665d4" },
            textStyle: { color: "#fff" },
        },
        chartArea: { width: "80%", height: "70%" },
        colors: ["#6950a5"],
        legend: "none",
    };

    return (
        <Layout>
            <div className="container-home">
                <div className="card">
                    <h2 className="card-title">Fluxo de Veículos nessa Semana</h2>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="300px"
                        data={data}
                        options={options}
                    />
                    <button
                        className="report-button"
                        onClick={() => navigate('/relatorios')}
                    >
                        Mais Relatórios
                    </button>
                </div>
                <div className="home-extras">
                    <div className="extras-titulo">
                        <h2>Resumo Gerencial</h2>
                        <p>Descrição da situação atual do seu local!</p>
                    </div>
                    <div className="situacao-home">
                        <div className="card-situacao">
                            <FaUsers size={40} color="#fff" />
                            <p className="titulo">Condutores Ativos</p>
                            <p>Quantidade de Condutores Ativos no seu Local: {quantidade}</p>
                            <button onClick={() => navigate('/condutores')}>Saiba Mais</button>
                        </div>
                        <div className="card-situacao">
                            <FaCar size={40} color="#fff" />
                            <p className="titulo">Veículos Presentes</p>
                            <p>Quantidade de Veículos Presentes no seu Local: {quantidade}</p>
                            <button onClick={() => navigate('/veiculos')}>Saiba Mais</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
