import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                email,
                password,
            });

            console.log(response.data); 

            // Salva o token JWT no localStorage
            localStorage.setItem('token', response.data.accessToken);

            // Redireciona para a página de upload
            router.push('/upload');
        } catch (err) {
            console.error('Erro na requisição:', err.response || err);
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        }
};

return (
    <div style={{ 
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    }}>
        <h1 style={{ 
            color: '#2c3e50', 
            textAlign: 'center',
            marginBottom: '30px'
        }}>
            Login
        </h1>
        
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '20px',
            padding: '25px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', color: '#2c3e50' }}>Email:</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', color: '#2c3e50' }}>Senha:</label>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                />
            </div>
            
            <button 
                type='submit'
                style={{
                    padding: '12px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '10px',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
                Entrar
            </button>
        </form>

        {error && (
            <div style={{
                padding: '15px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                margin: '20px 0',
                textAlign: 'center'
            }}>
                {error}
            </div>
        )}

        <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '15px',
            borderTop: '1px solid #eee'
        }}>
            <p style={{ color: '#7f8c8d' }}>
                Não possui uma conta?{' '}
                <a 
                    href="/register" 
                    style={{ 
                        color: '#3498db', 
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}
                >
                    Criar conta
                </a>
            </p>
        </div>
    </div>
    );
};