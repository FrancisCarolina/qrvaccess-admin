import React from 'react';
import Layout from '../../components/Layout';
import { Chart } from "react-google-charts";
import { FaUsers, FaCar } from 'react-icons/fa';  // Importando os ícones do react-icons/fa
import { useNavigate } from 'react-router-dom';  // Importando o hook useNavigate
import './styles.css'

const HomePage = () => {
    const quantidade = 10;
    const navigate = useNavigate();  // Usando o hook useNavigate para navegação

    const data = [
        ["Dia", "Quantidade"],
        ["Segunda", 10],
        ["Terça", 15],
        ["Quarta", 6],
        ["Quinta", 11],
        ["Sexta", 12],
        ["Sábado", 5],
        ["Domingo", null],
    ];

    const options = {
        backgroundColor: "#3a353e", // Cor de fundo do gráfico
        hAxis: {
            title: "Mês",
            titleTextStyle: { color: "#8665d4" },
            textStyle: { color: "#fff" }, // Cor do texto no eixo horizontal
        },
        vAxis: {
            minValue: 0,
            title: "Quantidade",
            titleTextStyle: { color: "#8665d4" },
            textStyle: { color: "#fff" }, // Cor do texto no eixo vertical
        },
        chartArea: { width: "80%", height: "70%" },
        colors: ["#6950a5"], // Cor da linha do gráfico
        legend: "none", // Esconde a legenda
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
                        onClick={() => navigate('/relatorios')}  // Navegação para a página de relatórios
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
                            <FaUsers size={40} color="#fff" /> {/* Ícone de pessoas usando react-icons */}
                            <p className="titulo">Condutores Ativos</p>
                            <p>Quantidade de Condutores Ativos no seu Local: {quantidade}</p>
                            <button onClick={() => navigate('/condutores')}>Saiba Mais</button> {/* Navegação para condutores */}
                        </div>
                        <div className="card-situacao">
                            <FaCar size={40} color="#fff" /> {/* Ícone de carro usando react-icons */}
                            <p className="titulo">Veículos Presentes</p>
                            <p>Quantidade de Veículos Presentes no seu Local: {quantidade}</p>
                            <button onClick={() => navigate('/veiculos')}>Saiba Mais</button> {/* Navegação para veículos */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
