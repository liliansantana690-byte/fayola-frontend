import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agendar from './pages/Agendar';

function App() {
    const [estabelecimento, setEstabelecimento] = useState(null);

    if (window.location.pathname === '/agendar') {
        return <Agendar />;
    }

    return estabelecimento
        ? <Dashboard estabelecimento={estabelecimento} />
        : <Login onLogin={setEstabelecimento} />;
}

export default App;