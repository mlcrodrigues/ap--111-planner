import React, { useState } from 'react';
import { User } from '../types';


interface AuthProps {
    onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simulação de validação
        if (!email || !password || (!isLoginView && !name)) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        console.log(`Simulando ${isLoginView ? 'login' : 'cadastro'} para:`, { name, email });
        // Em uma aplicação real, aqui você faria uma chamada para a API
        
        onLogin({ name: isLoginView ? 'Usuário' : name, email });
    };
    
    // Classes CSS puras
    const buttonStyle = {
        padding: '0.75rem 1rem', 
        borderRadius: '8px', 
        fontWeight: 600, 
        transition: 'color 0.2s',
        cursor: 'pointer',
        border: 'none',
        flex: 1
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '2.5rem auto' }}>
            <div className="card">
                <div className="flex" style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                    <button 
                        onClick={() => setIsLoginView(true)}
                        style={{ ...buttonStyle, color: isLoginView ? 'var(--color-accent)' : 'var(--color-sub-data)', borderBottom: isLoginView ? '2px solid var(--color-accent)' : 'none' }}
                    >
                        Entrar
                    </button>
                    <button 
                        onClick={() => setIsLoginView(false)}
                        style={{ ...buttonStyle, color: !isLoginView ? 'var(--color-accent)' : 'var(--color-sub-data)', borderBottom: !isLoginView ? '2px solid var(--color-accent)' : 'none' }}
                    >
                        Criar Conta
                    </button>
                </div>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
                    {isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                </h2>
                <p style={{ color: 'var(--color-sub-data)', textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isLoginView ? 'Faça login para acessar seus projetos.' : 'Salve seu progresso e compartilhe com outros.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                         <div>
                            <label className="data-label" style={{ marginBottom: '0.25rem' }}>Nome</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Seu nome completo"/>
                        </div>
                    )}
                    <div>
                        <label className="data-label" style={{ marginBottom: '0.25rem' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="voce@email.com"/>
                    </div>
                     <div>
                        <label className="data-label" style={{ marginBottom: '0.25rem' }}>Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••"/>
                    </div>
                    {error && <p className="text-danger" style={{ fontSize: '0.875rem', color: 'var(--color-danger)' }}>{error}</p>}
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isLoginView ? 'Entrar' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;