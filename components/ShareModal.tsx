import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ShareModalProps {
    onClose: () => void;
    projectName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, projectName }) => {
    const [copied, setCopied] = useState(false);
    
    // Simula um link de compartilhamento único
    const shareLink = `https://ape-planner.app/share/${projectName.toLowerCase().replace(/\s/g, '-')}-xyz789`;

    const handleCopy = () => {
        // Usa o método padrão para copiar para a área de transferência
        document.execCommand('copy');
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, [onClose]);

    return (
        // Overlay do Modal
        <div 
            style={{ 
                position: 'fixed', 
                inset: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                zIndex: 50, 
                padding: '1rem',
                animation: 'fadeInFast 0.3s'
            }} 
            onClick={onClose}
        >
            {/* Conteúdo do Modal */}
            <div 
                className="card" 
                style={{ 
                    backgroundColor: 'white', 
                    width: '100%', 
                    maxWidth: '400px', 
                    padding: '2rem', 
                    position: 'relative' 
                }} 
                onClick={e => e.stopPropagation()}
            >
                {/* Botão de Fechar */}
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-sub-data)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <XIcon style={{ width: '1.5rem', height: '1.5rem'}}/>
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>Compartilhar Projeto</h2>
                <p style={{ color: 'var(--color-sub-data)', marginBottom: '1.5rem' }}>Copie o link abaixo para compartilhar o projeto "{projectName}" com outras pessoas.</p>

                <div className="flex items-center gap-2">
                    <input 
                        type="text"
                        value={shareLink}
                        readOnly
                        // Estilização do Input de Link
                        style={{ 
                            flexGrow: 1, 
                            padding: '0.75rem', 
                            backgroundColor: '#F3F4F6', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '8px', 
                            color: 'var(--color-sub-data)' 
                        }}
                    />
                    <button 
                        onClick={handleCopy}
                        // Estilização do Botão Copiar (usando Coral e sucesso)
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            backgroundColor: copied ? 'var(--color-success)' : 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? <CheckIcon style={{ width: '1.5rem', height: '1.5rem'}}/> : 'Copiar'}
                    </button>
                </div>
                
                <p style={{ fontSize: '0.75rem', color: 'var(--color-sub-data)', marginTop: '1rem' }}>Qualquer pessoa com este link poderá visualizar o projeto. (Funcionalidade em desenvolvimento)</p>
            </div>
        </div>
    );
};

export default ShareModal;