import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './styles.css';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';

const ReportsPage = () => {
    const [filterType, setFilterType] = useState('daily');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.toISOString().split('T')[0];

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const handleFilterChange = (type) => {
        setFilterType(type);
        setIsButtonEnabled(false);
    };

    const handleDateChange = (e) => {
        const selected = e.target.value;
        if (selected <= currentDay) {
            setSelectedDate(selected);
            setIsButtonEnabled(true);
        }
    };

    const handleMonthChange = (e) => {
        const selected = e.target.value;
        if (
            selectedYear < currentYear ||
            (selectedYear === currentYear && parseInt(selected) <= currentMonth)
        ) {
            setSelectedMonth(selected);
            setIsButtonEnabled(true);
        }
    };

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value, 10);
        if (year <= currentYear) {
            setSelectedYear(year);
            setIsButtonEnabled(false);
        }
    };
    const user = useSelector((state) => state.user.user);

    const generateReport = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Token não encontrado.');
                return;
            }

            const baseUrl = `${process.env.REACT_APP_API_URL}/historico/local`;
            // Supondo que você armazena os dados do usuário no localStorage
            const localId = user?.Local?.id;

            if (!localId) {
                console.error('ID do local não encontrado.');
                return;
            }

            const url = `${baseUrl}/${localId}`;
            const params = { type: filterType };

            // Adiciona os parâmetros conforme o tipo de filtro
            if (filterType === 'daily') params.date = selectedDate;
            if (filterType === 'monthly') {
                params.month = selectedMonth;
                params.year = selectedYear;
            }

            const response = await axios.get(url, {
                headers: { 'x-access-token': token },
                params,
            });

            createPDF(response.data);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }
    };

    const createPDF = async (data) => {
        const sortedData = [...data].sort((a, b) =>
            a.Condutor.nome.localeCompare(b.Condutor.nome)
        );

        const pdfDoc = new jsPDF();
        pdfDoc.setFontSize(10); // Reduz o tamanho da fonte para caber mais conteúdo

        let positionY = 10; // Começa no topo da página
        const pageHeight = 297; // Altura padrão da página A4 em mm
        const lineHeight = 10; // Altura de cada linha de texto

        sortedData.forEach((item) => {
            const condutor = item.Condutor;

            // Adicionar condutor
            const condutorText = `Condutor: ${condutor.nome} (CPF: ${condutor.cpf})`;
            pdfDoc.text(10, positionY, condutorText);
            positionY += lineHeight;

            condutor.Veiculos.forEach((veiculo) => {
                if (veiculo.Historicos.length) {
                    const veiculoText = `  Veículo: ${veiculo.modelo} (${veiculo.placa}) - Marca: ${veiculo.marca}`;
                    pdfDoc.text(10, positionY, veiculoText);
                    positionY += lineHeight;

                    veiculo.Historicos.forEach((historico) => {
                        const historicoText = `    Entrada: ${new Date(
                            historico.data_entrada
                        ).toLocaleString()} - Saída: ${new Date(
                            historico.data_saida
                        ).toLocaleString()}`;
                        pdfDoc.text(10, positionY, historicoText);
                        positionY += lineHeight;

                        // Verificar se ultrapassou o limite da página
                        if (positionY > pageHeight - 20) {
                            pdfDoc.addPage(); // Adicionar nova página
                            positionY = 10; // Resetar posição para o topo
                        }
                    });
                }
            });

            // Adiciona espaço entre condutores
            positionY += lineHeight;

            if (positionY > pageHeight - 20) {
                pdfDoc.addPage();
                positionY = 10;
            }
        });
        const pdfBlob = pdfDoc.output("blob");
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, "_blank");
    };


    return (
        <Layout>
            <h2>Relatório de Veículos</h2>
            <div className="filter-container">
                <label>
                    <input
                        type="radio"
                        value="daily"
                        checked={filterType === 'daily'}
                        onChange={() => handleFilterChange('daily')}
                    />
                    Diário
                </label>
                <label>
                    <input
                        type="radio"
                        value="weekly"
                        checked={filterType === 'weekly'}
                        onChange={() => handleFilterChange('weekly')}
                    />
                    Semanal
                </label>
                <label>
                    <input
                        type="radio"
                        value="monthly"
                        checked={filterType === 'monthly'}
                        onChange={() => handleFilterChange('monthly')}
                    />
                    Mensal
                </label>
            </div>

            {filterType === 'daily' && (
                <input
                    type="date"
                    value={selectedDate}
                    max={currentDay}
                    onChange={handleDateChange}
                />
            )}

            {filterType === 'monthly' && (
                <div className="monthly-filter">
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">Selecione o mês</option>
                        {months.map((month, index) => (
                            <option
                                key={index}
                                value={index + 1}
                                disabled={
                                    selectedYear === currentYear && index + 1 > currentMonth
                                }
                            >
                                {month}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={handleYearChange}
                        min="2000"
                        max={currentYear}
                        placeholder="Ano"
                    />
                </div>
            )}

            <button
                disabled={!isButtonEnabled}
                onClick={generateReport}
                className="generate-button"
            >
                GERAR RELATÓRIO
            </button>
        </Layout>
    );
};

export default ReportsPage;
