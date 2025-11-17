import React, { useState } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const Contact: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulação de envio
        console.log('Formulário de contato enviado:', { name, email, message });
        setSubmitted(true);
    };
    
    const commonInputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669] transition-colors";

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto mt-10 animate-fade-in text-center">
                 <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500" />
                    <h2 className="text-2xl font-bold text-slate-800 mt-4">Mensagem Enviada!</h2>
                    <p className="text-slate-500 mt-2">Obrigado pelo seu contato. Responderemos em breve.</p>
                     <button 
                        onClick={() => setSubmitted(false)} 
                        className="mt-6 w-full py-3 px-4 rounded-lg font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                        Enviar nova mensagem
                    </button>
                 </div>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto mt-10 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Entre em Contato</h2>
                <p className="text-slate-500 text-center mb-8">Tem alguma dúvida, sugestão ou feedback? Adoraríamos ouvir você!</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-slate-500 block mb-1">Seu Nome</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className={commonInputClass} placeholder="Fulano de Tal" required />
                    </div>
                     <div>
                        <label htmlFor="email" className="text-sm font-medium text-slate-500 block mb-1">Seu E-mail</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} placeholder="fulano@email.com" required />
                    </div>
                     <div>
                        <label htmlFor="message" className="text-sm font-medium text-slate-500 block mb-1">Sua Mensagem</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className={commonInputClass} placeholder="Deixe sua mensagem aqui..." required />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 rounded-lg font-semibold bg-[#EF7669] text-white hover:bg-[#E65F4C] transition-colors shadow">
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
