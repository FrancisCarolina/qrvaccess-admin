import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './styles.css';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';
import MonthFilter from '../../components/MonthFilter';
import DateFilter from '../../components/DateFilter';

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

    const handleFilterChange = (type) => {
        setFilterType(type);
        setIsButtonEnabled(false);
        setSelectedDate("");
        setSelectedMonth("");
        setSelectedYear(new Date().getFullYear());
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
            const localId = user?.Local?.id;

            if (!localId) {
                console.error('ID do local não encontrado.');
                return;
            }

            const url = `${baseUrl}/${localId}`;
            const params = { type: filterType };

            if (filterType === 'daily' || filterType === 'weekly') params.date = selectedDate;
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
        pdfDoc.setFontSize(10);

        let positionY = 10;
        const pageHeight = 297;
        const lineHeight = 10;

        const title = `Relatório ${filterType === 'daily' ? "Diário" : filterType === 'weekly' ? "Semanal" : "Mensal"} - ${user?.Local?.nome}`;
        pdfDoc.setFont('helvetica', 'bold');
        pdfDoc.setFontSize(16);
        pdfDoc.text(10, positionY, title);
        positionY += lineHeight;

        if (filterType === 'monthly') {
            const monthDate = new Date(selectedYear, selectedMonth - 1);
            const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(monthDate);
            const date = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${selectedYear}`;
            pdfDoc.text(10, positionY, date);
            positionY += lineHeight;
        } else if (filterType === 'daily') {
            const startDate = new Date(selectedDate);
            startDate.setDate(startDate.getDate() + 1);
            const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(startDate));
            const date = `Dia selecionado: ${formattedDate}`;
            pdfDoc.text(10, positionY, date);
            positionY += lineHeight;
        } else if (filterType === 'weekly') {
            const startDate = new Date(selectedDate);
            startDate.setDate(startDate.getDate() + 1);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            const formattedStartDate = new Intl.DateTimeFormat('pt-BR').format(startDate);
            const formattedEndDate = new Intl.DateTimeFormat('pt-BR').format(endDate);

            const date = `Semana: ${formattedStartDate} até ${formattedEndDate}`;
            pdfDoc.text(10, positionY, date);
            positionY += lineHeight;
        }

        sortedData.forEach((item) => {
            const condutor = item.Condutor;

            const condutorText = `Condutor: ${condutor.nome} (CPF: ${condutor.cpf})`;
            pdfDoc.setFont('helvetica', 'bold');
            pdfDoc.setFontSize(12);
            pdfDoc.text(10, positionY, condutorText);
            positionY += lineHeight;

            condutor.Veiculos.forEach((veiculo) => {
                if (veiculo.Historicos.length) {
                    const veiculoText = `  Veículo: ${veiculo.modelo}(${veiculo.placa}) - ${veiculo.marca}`;
                    pdfDoc.setFont('helvetica', 'bold');
                    pdfDoc.setFontSize(10);
                    pdfDoc.text(10, positionY, veiculoText);
                    positionY += lineHeight;

                    veiculo.Historicos.forEach((historico) => {
                        const entradaTexto = `        Entrada: ${new Intl.DateTimeFormat('pt-BR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(historico.data_entrada))}`;
                        const saidaTexto = historico.data_saida
                            ? `               Saída: ${new Intl.DateTimeFormat('pt-BR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }).format(new Date(historico.data_saida))}`
                            : '               Saída: SEM SAÍDA REGISTRADA';

                        const historicoText = `${entradaTexto}${saidaTexto}`;
                        pdfDoc.setFont('helvetica', 'normal');
                        pdfDoc.text(10, positionY, historicoText);
                        positionY += lineHeight;

                        if (positionY > pageHeight - 20) {
                            pdfDoc.addPage();
                            positionY = 10;
                        }
                    });
                    positionY += lineHeight;
                }
            });

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
            <div className='relatorios-container'>
                <div className="relatorios">
                    <h1>Relatório de Veículos</h1>
                    <p>
                        Gere relatórios detalhados e precisos sobre a movimentação de veículos
                        em seu local. Tenha acesso a registros diários, semanais e mensais,
                        acompanhando de forma organizada todas as entradas e saídas.
                    </p>

                    <div className="tipo-relatorio">
                        <div className="radio-containers">
                            <input
                                type="radio"
                                id="diario"
                                name="relatorio"
                                value="diario"
                                checked={filterType === 'daily'}
                                onChange={() => handleFilterChange('daily')}
                            />
                            <label htmlFor="diario">Diário</label>
                        </div>
                        <div className="radio-containers">
                            <input
                                type="radio"
                                id="semanal"
                                name="relatorio"
                                value="semanal"
                                checked={filterType === 'weekly'}
                                onChange={() => handleFilterChange('weekly')}
                            />
                            <label htmlFor="semanal">Semanal</label>
                        </div>
                        <div className="radio-containers">
                            <input
                                type="radio"
                                id="mensal"
                                name="relatorio"
                                value="mensal"
                                checked={filterType === 'monthly'}
                                onChange={() => handleFilterChange('monthly')}
                            />
                            <label htmlFor="mensal">Mensal</label>
                        </div>
                    </div>

                    {filterType === 'daily' && (
                        <DateFilter selectedDate={selectedDate}
                            currentDay={currentDay}
                            handleDateChange={handleDateChange} />
                    )}
                    {filterType === 'weekly' && (
                        <DateFilter selectedDate={selectedDate}
                            currentDay={currentDay}
                            handleDateChange={handleDateChange} />
                    )}
                    {filterType === 'monthly' && (
                        <MonthFilter
                            selectedMonth={selectedMonth}
                            handleMonthChange={handleMonthChange}
                            selectedYear={selectedYear}
                            currentYear={currentYear}
                            currentMonth={currentMonth}
                            handleYearChange={handleYearChange}
                        />
                    )}

                    <div className="generate-report">
                        <button
                            onClick={generateReport}
                            disabled={!isButtonEnabled}
                            className="button"
                        >
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ReportsPage;
