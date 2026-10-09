import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002/api',
    withCredentials: true
});

api.interceptors.response.use(
    function(response) { return response; },
    function(error) {
        const url = (error.config && error.config.url) || '';
        const ehTentativaDeLogin = url.includes('/login');

        if (error.response && error.response.status === 401 && !ehTentativaDeLogin) {
            const noPainelProfissional = window.location.pathname.startsWith('/painel-profissional');
            localStorage.removeItem('estabelecimento_id');
            localStorage.removeItem('nome');
            localStorage.removeItem('profissional_id');
            window.location.href = noPainelProfissional ? '/painel-profissional/login' : '/login';
        }
        return Promise.reject(error);
    }
);

export default api;