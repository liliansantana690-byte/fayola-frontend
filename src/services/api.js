import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002/api',
    withCredentials: true
});

api.interceptors.response.use(
    function(response) { return response; },
    function(error) {
        const url = error.config?.url || '';
        const endpointPublico = /\/auth\/(login|cadastro|sessao|logout)|\/profissionais\/(login|convite\/)/.test(url);
        if (error.response && error.response.status === 401 && !endpointPublico) {
            const noPainelProfissional = window.location.pathname.startsWith('/painel-profissional');
            localStorage.removeItem('token');
            localStorage.removeItem('estabelecimento_id');
            localStorage.removeItem('nome');
            localStorage.removeItem('profissional_id');
            if (noPainelProfissional && !window.location.pathname.startsWith('/painel-profissional/ativar')) {
                window.location.href = '/painel-profissional/login';
            } else if (!['/login', '/cadastro', '/agendar'].includes(window.location.pathname)
                && !window.location.pathname.startsWith('/pedido-tattoo')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
