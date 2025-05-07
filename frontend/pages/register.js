import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
      });

      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro ao registrar:', err.response || err);
      setError(err.response?.data?.message || 'Erro ao criar conta.');
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
            Criar Conta
        </h1>
        
        <form onSubmit={handleRegister} style={{
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
                Registrar
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

        {success && (
            <div style={{
                padding: '15px',
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                margin: '20px 0',
                textAlign: 'center'
            }}>
                {success}
            </div>
        )}

        <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '15px',
            borderTop: '1px solid #eee'
        }}>
            <p style={{ color: '#7f8c8d' }}>
                Já tem uma conta?{' '}
                <a 
                    href="/login" 
                    style={{ 
                        color: '#3498db', 
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}
                >
                    Fazer login
                </a>
            </p>
        </div>
    </div>
  );
}