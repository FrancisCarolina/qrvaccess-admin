import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Chart } from "react-google-charts";
import { FaUsers, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './styles.css';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [chartTitle, setChartTitle] = useState("");
    const [quantCondutores, setQuantCondutores] = useState(0);
    const [quantVeiculos, setQuantVeiculos] = useState(0);
    const navigate = useNavigate();


    const user = useSelector((state) => state.user.user);

    const getCondutoresAtivos = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/condutor/local/${user.Local?.id}`,
                {
                    headers: { 'x-access-token': token },
                }
            );
            const condutores = response.data;
            let countCondutorAtivo = 0;
            condutores.forEach(condutor => {
                if (condutor.ativo) {
                    countCondutorAtivo += 1;
                }
            })
            setQuantCondutores(countCondutorAtivo);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    const fetchData = async () => {
        const today = new Date();
        const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
        const nextSaturday = new Date(lastSunday);
        nextSaturday.setDate(nextSaturday.getDate() + 6);

        const formattedStartDate = lastSunday.toLocaleDateString('pt-BR');
        const formattedEndDate = nextSaturday.toLocaleDateString('pt-BR');

        setChartTitle(`De ${formattedStartDate} até ${formattedEndDate}`);

        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/historico/local/${user.Local?.id}?type=weekly&date=${lastSunday.toISOString().split('T')[0]}`,
                {
                    headers: { 'x-access-token': token },
                }
            );

            const historicos = response.data;
            let countsByDay = {};

            for (let index = 0; index < 7; index++) {
                const day = new Date(lastSunday);
                day.setDate(day.getDate() + index);

                countsByDay = {
                    ...countsByDay,
                    [day.toLocaleDateString('pt-BR', { weekday: 'long' })]: 0,
                };
            }
            let condutor, countVeiculosPresentes = 0;
            historicos.forEach((item) => {
                item.Condutor?.Veiculos.forEach((veiculo) => {
                    veiculo.Historicos.forEach((historico) => {
                        const entrada = new Date(historico.data_entrada);
                        const dayName = entrada.toLocaleDateString('pt-BR', { weekday: 'long' });
                        countsByDay[dayName] += 1;
                        if (condutor !== item.Condutor && historico.data_saida === null) {
                            countVeiculosPresentes += 1;
                            condutor = item.Condutor;
                        }
                    });
                });
            });
            getCondutoresAtivos();
            setQuantVeiculos(countVeiculosPresentes);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const options = {
        title: chartTitle,
        titleTextStyle: { color: "#fff", fontSize: 16, fontName: "Consolas", },
        backgroundColor: "#3a353e",
        hAxis: {
            title: "Mês",
            titleTextStyle: { color: "#8665d4", fontName: "Consolas", },
            textStyle: { color: "#fff", fontName: "Consolas", },
        },
        vAxis: {
            minValue: 0,
            title: "Quantidade",
            titleTextStyle: { color: "#8665d4", fontName: "Consolas", },
            textStyle: { color: "#fff", fontName: "Consolas", },
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
                            <p>Quantidade de Condutores Ativos no seu Local: {quantCondutores}</p>
                            <button onClick={() => navigate('/condutores')}>Saiba Mais</button>
                        </div>
                        <div className="card-situacao">
                            <FaCar size={40} color="#fff" />
                            <p className="titulo">Veículos Presentes</p>
                            <p>Quantidade de Veículos Presentes no seu Local: {quantVeiculos}</p>
                            <button onClick={() => navigate('/veiculos')}>Saiba Mais</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
