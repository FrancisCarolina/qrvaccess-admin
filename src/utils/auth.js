// Função para logar
export function logar(token, userId) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
}

export function deslogar() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
}

export function verificaSeLogado() {
    return !!localStorage.getItem('authToken');
}

export function obterUserId() {
    return localStorage.getItem('userId');
}
