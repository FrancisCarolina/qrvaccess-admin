import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const MonthFilter = ({
    selectedMonth,
    handleMonthChange,
    selectedYear,
    currentYear,
    currentMonth,
    handleYearChange,
}) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    return (
        <Form className="filtro-mensal">
            <Row className="align-items-center">
                <Col xs={12} md={6}>
                    <Form.Group controlId="monthSelect">
                        <Form.Label>Mês</Form.Label>
                        <Form.Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
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
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group controlId="yearInput">
                        <Form.Label>Ano</Form.Label>
                        <Form.Control
                            type="number"
                            value={selectedYear}
                            onChange={handleYearChange}
                            min="2000"
                            max={currentYear}
                            placeholder="Digite o ano"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default MonthFilter;
