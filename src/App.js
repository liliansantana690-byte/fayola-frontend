import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendar from './pages/Agendar';
import Landing from './pages/Landing';

function App() {
    const [estabelecimento, setEstabelecimento] = useState(null);

    if (window.location.pathname === '/agendar') {
        return <Agendar />;
    }

    if (estabelecimento) {
        return <Dashboard estabelecimento={estabelecimento} />;
    }

    if (window.location.pathname === '/login') {
        return <Login onLogin={setEstabelecimento} />;
    }

    return <Landing />;
}

export default App;