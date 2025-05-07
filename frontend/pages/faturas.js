import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FaturasPage() {
    const [faturas, setFaturas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFaturas = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Você precisa estar autenticado para ver as faturas.');
                return;
            }

            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${apiUrl}/api/me/documents`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFaturas(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao buscar as faturas.');
            } finally {
                setLoading(false);
            }
        };

        fetchFaturas();
    }, []);

    const formatText = (text) => {
        if (!text) return '';
        if (typeof text === 'object') text = JSON.stringify(text);
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

    const downloadPdf = async (id, filename) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Você precisa estar autenticado para baixar o PDF.');
            return;
        }
    
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.get(`${apiUrl}/api/download/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });
    
            // Cria um URL temporário para o blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Cria um link temporário e dispara o download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename.replace(/\.[^/.]+$/, '')}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // Limpa o URL e remove o elemento
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao baixar o PDF.');
            console.error('Erro no download:', err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Todas as Faturas</h1>

            {loading && <p>Carregando faturas...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {faturas.map((fatura) => (
                <div key={fatura.id} style={{
                    marginBottom: '30px',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#fefefe',
                }}>
                    <h2 style={{ color: '#2c3e50' }}>{fatura.filename}</h2>
                    <p><strong>Criado em:</strong> {new Date(fatura.createdAt).toLocaleString()}</p>
                    <div style={{ marginTop: '10px' }}>
                        <h3 style={{ color: '#3498db' }}>Texto:</h3>
                        <div style={{
                            whiteSpace: 'pre-wrap',
                            backgroundColor: '#f8f9fa',
                            padding: '10px',
                            borderRadius: '4px',
                            borderLeft: '4px solid #3498db',
                        }}>
                            {formatText(fatura.text)}
                        </div>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <h3 style={{ color: '#3498db' }}>Explicação:</h3>
                        <div style={{
                            whiteSpace: 'pre-line',
                            backgroundColor: '#e8f4fc',
                            padding: '10px',
                            borderRadius: '4px',
                        }}>
                            {formatText(fatura.explanation)}
                        </div>
                        <button
                            onClick={() => downloadPdf(fatura.id, fatura.filename)}
                            style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            >
                            Baixar PDF
                            </button>
                    </div>
                </div>
            ))}
        </div>
    );
}