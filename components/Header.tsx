import React, { useState } from 'react';
import { View } from '../App';
import { User } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { ShareIcon } from './icons/ShareIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
// Importa o novo componente SvgLogo
import SvgLogo from './SvgLogo';


interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  onShare: () => void;
}

const navItems: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'costs', label: 'Custos' },
  { view: 'rooms', label: 'Cômodos' },
  { view: 'purchases', label: 'Compras' },
  { view: 'bills', label: 'Contas' },
  { view: 'journey', label: 'Jornada' },
  { view: 'contact', label: 'Contato' },
];

const NavLink: React.FC<{
  view: View;
  label: string;
  currentView: View;
  onClick: () => void;
}> = ({ view, label, currentView, onClick }) => (
  <button
    onClick={onClick}
    className={`${currentView === view ? 'active' : ''}`}
  >
    {label}
  </button>
);

// O componente AppTitle é substituído pelo SvgLogo
// const AppTitle: React.FC = () => (
//     <div className="flex items-center">
//         <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>Apê</h1>
//         <span className="logo-accent" style={{ fontSize: '1.8rem', fontWeight: 400 }}>111</span>
//     </div>
// );


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, user, onLogout, onShare }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
      {/* O container agora envolve todo o conteúdo do header */}
      <div className="container">
        <div className="header-content"> {/* Usa a nova classe para alinhar o conteúdo */}

          <SvgLogo /> {/* Renderiza o logo SvgLogo */}

          <nav className="nav-links-desktop"> {/* Links para desktop */}
            {navItems.map(item => (
              <NavLink
                key={item.view}
                view={item.view}
                label={item.label}
                currentView={currentView}
                onClick={() => handleNavClick(item.view)}
              />
            ))}
          </nav>

          <div className="header-actions flex items-center gap-4"> {/* Ações de usuário/share */}
            {user ? (
              <>
                <button onClick={onShare} className="btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
                  <ShareIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span className="hidden-on-small-mobile">Compartilhar</span>
                </button>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <UserIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <button onClick={onLogout} className="icon-btn-remove" style={{ color: 'white', background: 'none' }}>
                  <LogoutIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Login
              </button>
            )}
          </div>

          {/* Menu Móvel (Toggle) */}
          <div className="mobile-menu-toggle">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <MenuIcon style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Aberto Móvel */}
      {isMenuOpen && (
        <nav className="nav-links-mobile" style={{
          position: 'absolute',
          top: '70%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-primary)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          padding: '1rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navItems.map(item => (
            <NavLink
              key={item.view}
              view={item.view}
              label={item.label}
              currentView={currentView}
              onClick={() => handleNavClick(item.view)}
            />
          ))}
          {/* Adicionar Login/Logout/Share no menu mobile */}
          {!user && (
            <button
              onClick={() => handleNavClick('auth')}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Login / Criar Conta
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;