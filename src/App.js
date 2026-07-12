import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    const [estabelecimento, setEstabelecimento] = useState(null);

    return estabelecimento
        ? <Dashboard estabelecimento={estabelecimento} />
        : <Login onLogin={setEstabelecimento} />;
}

export default App;