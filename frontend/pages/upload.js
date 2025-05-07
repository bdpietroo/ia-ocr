import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Por favor, selecione um arquivo.');
            return;
        };

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Você precisa estar autenticado para enviar arquivos.');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // Obtenha o token JWT do localStorage
            const res = await axios.post('http://localhost:4000/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResponse(res.data); // Salva a resposta do backend
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer upload do arquivo.');   
        } finally {
            setLoading(false);
        }
    };

    const formatText = (text) => {
        if (!text) return '';
        
        // Se for um objeto, tente convertê-lo para string
        if (typeof text === 'object' && text !== null) {
            try {
                text = JSON.stringify(text);
            } catch (e) {
                text = String(text);
            }
        }
    
        // Processa os marcadores de formatação
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={i}>{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };
    
    return (
        <div style={{ 
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Envio de Imagem</h1> 
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
            }}>
                <input 
                    type='file' 
                    onChange={handleFileChange}
                    style={{ padding: '10px' }}
                />
                <button 
                    type='submit' 
                    disabled={loading}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: loading ? '#95a5a6' : '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>

                <button 
                    type="button"
                    onClick={() => router.push('/faturas')}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Todas as faturas
                </button>
            </form>

            {loading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p>Processando documento...</p>
                </div>
            )}

            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    margin: '20px 0'
                }}>
                    {error}
                </div>
            )}

            {response && (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        color: '#2c3e50',
                        borderBottom: '2px solid #3498db',
                        paddingBottom: '10px',
                        marginBottom: '20px'
                    }}>
                        Resultado
                    </h2>
                    
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#3498db' }}>Texto Extraído:</h3>
                        <div style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '4px',
                            borderLeft: '4px solid #3498db'
                        }}>
                            {formatText(response.text)}
                        </div>
                    </div>
                    
                    <div>
                        <h3 style={{ color: '#3498db' }}>Explicação:</h3>
                        <div style={{
                            whiteSpace: 'pre-line',
                            lineHeight: '1.6',
                            padding: '15px',
                            backgroundColor: '#e8f4fc',
                            borderRadius: '4px'
                        }}>
                            {formatText(response.explanation)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}