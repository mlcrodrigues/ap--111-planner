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
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
        });
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="h-6 w-6"/>
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Compartilhar Projeto</h2>
                <p className="text-slate-500 mb-6">Copie o link abaixo para compartilhar o projeto "{projectName}" com outras pessoas.</p>

                <div className="flex items-center space-x-2">
                    <input 
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-grow p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                    />
                    <button 
                        onClick={handleCopy}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all w-32 flex items-center justify-center ${
                            copied ? 'bg-green-500 text-white' : 'bg-[#EF7669] text-white hover:bg-[#E65F4C]'
                        }`}
                    >
                        {copied ? <CheckIcon className="h-6 w-6"/> : 'Copiar'}
                    </button>
                </div>
                
                <p className="text-xs text-slate-400 mt-4">Qualquer pessoa com este link poderá visualizar o projeto. (Funcionalidade em desenvolvimento)</p>
            </div>
        </div>
    );
};

export default ShareModal;