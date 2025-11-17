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
    
    const commonInputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669]";
    const commonButtonClass = "w-full py-3 px-4 rounded-lg font-semibold transition-colors";

    return (
        <div className="max-w-md mx-auto mt-10 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex border-b border-slate-200 mb-6">
                    <button 
                        onClick={() => setIsLoginView(true)}
                        className={`flex-1 pb-3 text-lg font-bold text-center ${isLoginView ? 'text-[#EF7669] border-b-2 border-[#EF7669]' : 'text-slate-500'}`}
                    >
                        Entrar
                    </button>
                    <button 
                        onClick={() => setIsLoginView(false)}
                        className={`flex-1 pb-3 text-lg font-bold text-center ${!isLoginView ? 'text-[#EF7669] border-b-2 border-[#EF7669]' : 'text-slate-500'}`}
                    >
                        Criar Conta
                    </button>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
                    {isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                </h2>
                <p className="text-slate-500 text-center mb-6">
                    {isLoginView ? 'Faça login para acessar seus projetos.' : 'Salve seu progresso e compartilhe com outros.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                         <div>
                            <label className="text-sm font-medium text-slate-500 block mb-1">Nome</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={commonInputClass} placeholder="Seu nome completo"/>
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} placeholder="voce@email.com"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={commonInputClass} placeholder="••••••••"/>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className={`${commonButtonClass} bg-[#EF7669] text-white hover:bg-[#E65F4C]`}>
                        {isLoginView ? 'Entrar' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
