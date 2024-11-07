import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setDrivers, selectDrivers } from '../redux/driverSlice';
import Layout from '../components/Layout';

const DriversPage = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user.user);
    const drivers = useSelector(selectDrivers);

    useEffect(() => {
        const fetchDrivers = async () => {
            const token = localStorage.getItem('authToken');

            if (token && user && user.local && user.local.id) {
                try {
                    if (drivers.length === 0) {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/condutor/local/${user.local.id}`, {
                            headers: { 'x-access-token': token },
                        });
                        console.log("RESPONSE: ", response.data);

                        dispatch(setDrivers(response.data));
                    }
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar condutores:', error);
                    setLoading(false);
                }
            } else {
                console.error('Usuário ou token não encontrado.');
                setLoading(false); // Se não encontrar o usuário ou token, defina o loading como false
            }
        };

        fetchDrivers();
    }, [user, drivers, dispatch]); // Adiciona o `drivers` e `dispatch` como dependências

    if (loading) {
        return <div>Carregando...</div>; // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    }

    return (
        <Layout>
            <h2>Condutores</h2>
            <ul>
                {drivers.map((driver) => (
                    <li key={driver.id}>{driver.nome}</li>
                ))}
            </ul>
        </Layout>
    );
};

export default DriversPage;
