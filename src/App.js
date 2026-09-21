import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendar from './pages/Agendar';
import Landing from './pages/Landing';
import LoginProfissional from './pages/LoginProfissional';
import AtivarContaProfissional from './pages/AtivarContaProfissional';
import PainelProfissional from './pages/PainelProfissional';

function App() {
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [profissional, setProfissional] = useState(
        localStorage.getItem('token') && localStorage.getItem('profissional_id')
            ? { nome: localStorage.getItem('nome') }
            : null
    );

    const path = window.location.pathname;

    if (path === '/agendar') {
        return <Agendar />;
    }

    if (path === '/painel-profissional/ativar') {
        return <AtivarContaProfissional />;
    }

    if (path === '/painel-profissional/login') {
        if (profissional) {
            window.location.href = '/painel-profissional';
            return null;
        }
        return <LoginProfissional onLogin={setProfissional} />;
    }

    if (path === '/painel-profissional') {
        if (!profissional) {
            window.location.href = '/painel-profissional/login';
            return null;
        }
        return <PainelProfissional nome={profissional.nome} onLogout={function() { setProfissional(null); }} />;
    }

    if (estabelecimento) {
        return <Dashboard estabelecimento={estabelecimento} />;
    }

    if (path === '/login') {
        return <Login onLogin={setEstabelecimento} />;
    }

    return <Landing />;
}

export default App;