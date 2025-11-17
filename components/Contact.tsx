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
    
    // Classes CSS puras
    const successIconStyle = { width: '4rem', height: '4rem', margin: '0 auto', color: 'var(--color-success)' };

    if (submitted) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '500px', margin: '2.5rem auto', textAlign: 'center' }}>
                 <div className="card" style={{ padding: '2rem' }}>
                    <CheckCircleIcon style={successIconStyle} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-dark)', marginTop: '1rem' }}>Mensagem Enviada!</h2>
                    <p style={{ color: 'var(--color-sub-data)', marginTop: '0.5rem' }}>Obrigado pelo seu contato. Responderemos em breve.</p>
                     <button 
                        onClick={() => setSubmitted(false)} 
                        className="btn-secondary"
                        style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                        Enviar nova mensagem
                    </button>
                 </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '500px', margin: '2.5rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-dark)', textAlign: 'center', marginBottom: '0.5rem' }}>Entre em Contato</h2>
                <p style={{ color: 'var(--color-sub-data)', textAlign: 'center', marginBottom: '2rem' }}>Tem alguma dúvida, sugestão ou feedback? Adoraríamos ouvir você!</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="data-label" style={{ marginBottom: '0.25rem' }}>Seu Nome</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Fulano de Tal" required />
                    </div>
                     <div>
                        <label htmlFor="email" className="data-label" style={{ marginBottom: '0.25rem' }}>Seu E-mail</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="fulano@email.com" required />
                    </div>
                     <div>
                        <label htmlFor="message" className="data-label" style={{ marginBottom: '0.25rem' }}>Sua Mensagem</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="input-field" placeholder="Deixe sua mensagem aqui..." required style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;