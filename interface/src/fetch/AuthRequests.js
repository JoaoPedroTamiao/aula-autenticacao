class AuthRequests {
    
    constructor() {
        this.serverUrl = 'http://localhost:3333';
        this.routeLogin = '/login';
    }

    async login(login) {       
        try {
            const response = await fetch(`${this.serverUrl}${this.routeLogin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });
            
            if (!response.ok) {
                console.log('Erro na autenticação');
                throw new Error('Falha no login');
            }
            
            const data = await response.json();
            console.log(data);

            if (data.auth) {
                this.persistToken(data.token, data.usuario.nome, data.usuario.id_usuario);
            }

            return true;
        } catch (error) {
            console.error('Erro: ', error);
            throw error;
        }
    }

    persistToken(token, username, idUsuario) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('idUsuario', idUsuario);
    }

    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('idUsuario');

        // Redireciona o usuário para a página de login
        window.location.href = '/login';
    }

    checkTokenExpiry() {
        const token = localStorage.getItem('token');
        
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            const now = Math.floor(Date.now() / 1000);

            if (expiry < now) {
                this.removeToken();
                return false;
            }
            return true;
        }
        return false;
    }
}

export default new AuthRequests();
