import api from './api';

function authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
}

// ===== Público (cliente) =====

export async function buscarDia(profissionalId, dataYMD) {
    const r = await api.get('/disponibilidade/dia', {
        params: { profissional_id: profissionalId, data: dataYMD }
    });
    return r.data;
}

export async function buscarStatusPedido(token) {
    const r = await api.get(`/pedidos-tattoo/${token}/status`);
    return r.data;
}

export async function confirmarHorarioPedido(token, dataHora) {
    const r = await api.patch(`/pedidos-tattoo/${token}/confirmar-horario`, { data_hora: dataHora });
    return r.data;
}

// ===== Profissional logado =====

export async function buscarHorariosSemanais(profissionalId) {
    const r = await api.get(`/disponibilidade/horarios/${profissionalId}`);
    return r.data;
}

export async function salvarHorariosSemanais(horarios) {
    const r = await api.put('/disponibilidade/horarios', { horarios }, authHeaders());
    return r.data;
}

export async function listarBloqueios(profissionalId) {
    const r = await api.get(`/disponibilidade/bloqueios/${profissionalId}`);
    return r.data;
}

export async function bloquearDia(data, motivo) {
    const r = await api.post('/disponibilidade/bloqueios', { data, motivo }, authHeaders());
    return r.data;
}

export async function desbloquearDia(id) {
    const r = await api.delete(`/disponibilidade/bloqueios/${id}`, authHeaders());
    return r.data;
}