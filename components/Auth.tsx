import React, { useState } from 'react';
import { User } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthProps {
    onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password || (!isLoginView && !name)) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            if (isLoginView) {
                // Login
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                onLogin({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Usuário',
                    email: firebaseUser.email
                });
            } else {
                // Cadastro
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                // Atualizar nome do perfil
                await updateProfile(firebaseUser, { displayName: name });

                onLogin({
                    uid: firebaseUser.uid,
                    name: name,
                    email: firebaseUser.email
                });
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            let msg = "Ocorreu um erro. Tente novamente.";
            if (err.code === 'auth/wrong-password') msg = "Senha incorreta.";
            if (err.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
            if (err.code === 'auth/email-already-in-use') msg = "Este email já está em uso.";
            if (err.code === 'auth/weak-password') msg = "A senha deve ter pelo menos 6 caracteres.";
            if (err.code === 'auth/invalid-email') msg = "Email inválido.";
            // Se não for um erro conhecido, mostra a mensagem original (para debug) ou mantém a genérica
            if (!msg.includes('.')) msg = `Erro: ${err.message}`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Classes CSS puras
    const buttonStyle = {
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontWeight: 600,
        transition: 'color 0.2s',
        cursor: 'pointer',
        border: 'none',
        flex: 1,
        background: 'none'
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
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Seu nome completo" />
                        </div>
                    )}
                    <div>
                        <label className="data-label" style={{ marginBottom: '0.25rem' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="voce@email.com" />
                    </div>
                    <div>
                        <label className="data-label" style={{ marginBottom: '0.25rem' }}>Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
                    </div>
                    {error && <p className="text-danger" style={{ fontSize: '0.875rem', color: 'var(--color-danger)' }}>{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Carregando...' : (isLoginView ? 'Entrar' : 'Criar Conta')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;