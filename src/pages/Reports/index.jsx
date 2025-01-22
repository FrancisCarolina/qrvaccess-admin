import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './styles.css';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';
import MonthFilter from '../../components/MonthFilter';
import DateFilter from '../../components/DateFilter';
import { Form, Button, Row, Col } from 'react-bootstrap';

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
        pdfDoc.setFontSize(10); // Reduz o tamanho da fonte para caber mais conteúdo

        let positionY = 10; // Começa no topo da página
        const pageHeight = 297; // Altura padrão da página A4 em mm
        const lineHeight = 10; // Altura de cada linha de texto

        const title = `Relatório ${filterType === 'daily' ? "Diário" : filterType === 'weekly' ? "Semanal" : "Mensal"} - ${user?.Local?.nome}`
        pdfDoc.setFont('helvetica', 'bold'); // Título em negrito
        pdfDoc.setFontSize(16);
        pdfDoc.text(10, positionY, title);
        positionY += lineHeight;

        if (filterType === 'monthly') {
            // Obter o nome do mês a partir de selectedMonth e selectedYear
            const monthDate = new Date(selectedYear, selectedMonth - 1); // selectedMonth deve ser um número (1-12)
            const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(monthDate);
            const date = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${selectedYear}`; // Capitaliza o nome do mês
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

            // Adicionar condutor
            const condutorText = `Condutor: ${condutor.nome} (CPF: ${condutor.cpf})`;
            pdfDoc.setFont('helvetica', 'bold'); // Título em negrito
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
                        const historicoText = `        Entrada: ${new Date(
                            historico.data_entrada
                        ).toLocaleString()
                            }               Saída: ${new Date(
                                historico.data_saida
                            ).toLocaleString()
                            }`;
                        pdfDoc.setFont('helvetica', 'normal');
                        pdfDoc.text(10, positionY, historicoText);
                        positionY += lineHeight;

                        // Verificar se ultrapassou o limite da página
                        if (positionY > pageHeight - 20) {
                            pdfDoc.addPage(); // Adicionar nova página
                            positionY = 10; // Resetar posição para o topo
                        }
                    });
                    positionY += lineHeight;
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
            <h2 className="mb-4">Relatório de Veículos</h2>

            <Form.Group className="mb-3">
                <Row>
                    <Col>
                        <Form.Check
                            type="radio"
                            id="dailyFilter"
                            name="filter"
                            value="daily"
                            label="Diário"
                            checked={filterType === 'daily'}
                            onChange={() => handleFilterChange('daily')}
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            id="weeklyFilter"
                            name="filter"
                            value="weekly"
                            label="Semanal"
                            checked={filterType === 'weekly'}
                            onChange={() => handleFilterChange('weekly')}
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            id="monthlyFilter"
                            name="filter"
                            value="monthly"
                            label="Mensal"
                            checked={filterType === 'monthly'}
                            onChange={() => handleFilterChange('monthly')}
                        />
                    </Col>
                </Row>
            </Form.Group>

            {(filterType === 'daily' || filterType === 'weekly') && (
                <DateFilter
                    selectedDate={selectedDate}
                    currentDay={currentDay}
                    handleDateChange={handleDateChange}
                />
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

            <Button
                variant="primary"
                disabled={!isButtonEnabled}
                onClick={generateReport}
                className="mt-4"
            >
                GERAR RELATÓRIO
            </Button>
        </Layout>
    );
};

export default ReportsPage;
