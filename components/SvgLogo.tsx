import React from 'react';

// Um Símbolo simples representando um bloco/apartamento
const BlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7v10l10 5 10-5V7z" fill="var(--color-accent)"/> {/* Estrutura do Apê (Coral) */}
    <path d="M12 2v20M2 7l10 5 10-5M2 17l10 5 10-5" fill="none" stroke="white" strokeWidth="1.5"/>
    <rect x="7" y="10" width="10" height="8" rx="1" ry="1" fill="white"/> {/* Janela / Porta */}
  </svg>
);


interface SvgLogoProps {
    isMobile?: boolean;
    style?: React.CSSProperties;
}

// Renderiza o logo tipográfico Apê 111
const SvgLogo: React.FC<SvgLogoProps> = ({ isMobile = false, style = {} }) => {
    // Definimos o tamanho da fonte com base na variável isMobile (para simular a diferença)
    const fontSize = isMobile ? '1.5rem' : '1.8rem';
    
    // O logo usa o Azul Marinho e o Coral
    return (
        <div style={{ display: 'flex', alignItems: 'center', ...style }}>
            {/* Opcionalmente, pode-se incluir um ícone aqui */}
            {/* <BlockIcon style={{ width: '1.8rem', height: '1.8rem', marginRight: '0.5rem', color: 'var(--color-accent)' }} /> */}
            <span style={{ fontSize: fontSize, fontWeight: 700, color: 'white' }}>Apê</span>
            <span style={{ fontSize: fontSize, fontWeight: 400, color: 'var(--color-accent)', marginLeft: '0.25rem' }}>111</span>
        </div>
    );
}

export default SvgLogo;