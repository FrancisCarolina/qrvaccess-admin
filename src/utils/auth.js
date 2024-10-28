export function logar(token) {
    localStorage.setItem('authToken', token);
}

export function deslogar() {
    localStorage.removeItem('authToken');
}

export function verificaSeLogado() {
    return !!localStorage.getItem('authToken');
}
  