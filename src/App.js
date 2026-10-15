import React, { useEffect, useState } from 'react';
import api from './services/api';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendar from './pages/Agendar';
import Landing from './pages/Landing';
import LoginProfissional from './pages/LoginProfissional';
import AtivarContaProfissional from './pages/AtivarContaProfissional';
import PainelProfissional from './pages/PainelProfissional';
import PedirTattoo from './pages/PedirTattoo';

function App() {
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [profissional, setProfissional] = useState(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);

    async function encerrarSessao() {
        try {
            await api.post('/auth/logout');
        } catch (err) {}
        setEstabelecimento(null);
        setProfissional(null);
        window.location.href = window.location.pathname.startsWith('/painel-profissional')
            ? '/painel-profissional/login'
            : '/login';
    }

    useEffect(function() {
        let ativo = true;
        localStorage.removeItem('token');
        localStorage.removeItem('estabelecimento_id');
        localStorage.removeItem('profissional_id');
        localStorage.removeItem('nome');
        api.get('/auth/sessao')
            .then(function(res) {
                if (!ativo) return;
                if (res.data.tipo === 'estabelecimento') {
                    setEstabelecimento({
                        estabelecimento_id: res.data.estabelecimento_id,
                        nome: res.data.nome
                    });
                } else if (res.data.tipo === 'profissional') {
                    setProfissional({
                        profissional_id: res.data.profissional_id,
                        nome: res.data.nome
                    });
                }
            })
            .catch(function() {})
            .finally(function() {
                if (ativo) setCarregandoSessao(false);
            });
        return function() { ativo = false; };
    }, []);

    const path = window.location.pathname;

    if (path === '/pedido-tattoo' || path.startsWith('/pedido-tattoo/')) {
        return <PedirTattoo />;
    }

    if (path === '/painel-profissional/ativar') {
        return <AtivarContaProfissional />;
    }
    if (path === '/agendar') {
        return <Agendar />;
    }

    if (carregandoSessao) {
        return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0a0a', color: '#888' }}>Carregando...</div>;
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
        return <PainelProfissional nome={profissional.nome} onLogout={encerrarSessao} />;
    }

    if (estabelecimento) {
        return <Dashboard estabelecimento={estabelecimento} onLogout={encerrarSessao} />;
    }

    if (path === '/login') {
        return <Login onLogin={setEstabelecimento} />;
    }

        if (path === '/cadastro') {
        return <Cadastro />;
    }
    
    return <Landing />;
}

export default App;
