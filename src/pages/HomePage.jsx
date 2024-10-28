import React from 'react';

import { useNavigate } from 'react-router-dom';
import { deslogar, verificaSeLogado } from '../utils/auth';

const HomePage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!verificaSeLogado()) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        deslogar();
        navigate('/login');
    };

    return (
        verificaSeLogado() ? (
            <div className="d-flex flex-column align-items-center">
                <h2>HOME</h2>
                <button onClick={handleLogout} className="btn btn-danger mt-3">
                    Deslogar
                </button>
            </div>
        ) : null
    );

};

export default HomePage;
