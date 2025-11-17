import React, { useState } from 'react';
import { View } from '../App';
import { User } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { ShareIcon } from './icons/ShareIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';


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
  isMobile?: boolean;
}> = ({ view, label, currentView, onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    className={`font-semibold tracking-wide transition-colors duration-200 ${
      isMobile
        ? `w-full text-left p-4 text-lg ${currentView === view ? 'bg-[#202945] text-[#EF7669]' : 'text-slate-700 hover:bg-slate-200'}`
        : `px-4 py-2 rounded-md text-sm ${currentView === view ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`
    }`}
  >
    {label}
  </button>
);

const AppTitle: React.FC = () => (
    <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">Apê</h1>
        <p className="text-3xl font-bold text-[#EF7669] tracking-tighter">111</p>
    </div>
);


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, user, onLogout, onShare }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#202945] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <AppTitle />
          <nav className="hidden md:flex items-center space-x-2">
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

          <div className="hidden md:flex items-center space-x-2">
            {user ? (
                 <>
                    <button onClick={onShare} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all bg-slate-200 text-slate-600 hover:bg-slate-300">
                        <ShareIcon className="h-5 w-5" />
                        <span>Compartilhar</span>
                    </button>
                    <div className="p-2 rounded-full bg-slate-500 text-white">
                        <UserIcon className="h-6 w-6" />
                    </div>
                     <button onClick={onLogout} className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10">
                        <LogoutIcon className="h-6 w-6" />
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setCurrentView('auth')}
                    className="bg-[#EF7669] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#E65F4C] shadow transition-transform transform hover:scale-105"
                >
                    Login
                </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white focus:outline-none"
              aria-label="Abrir menu"
            >
              <MenuIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
        <div className="relative w-72 max-w-[80vw] h-full bg-slate-100 shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                 <AppTitle />
                <button onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-slate-900" aria-label="Fechar menu">
                  <XIcon className="h-7 w-7" />
                </button>
            </div>
            <nav className="flex-grow py-4">
                {navItems.map(item => (
                <NavLink
                    key={item.view}
                    view={item.view}
                    label={item.label}
                    currentView={currentView}
                    onClick={() => handleNavClick(item.view)}
                    isMobile={true}
                />
                ))}
            </nav>
             <div className="p-4 border-t">
                {user ? (
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                            <UserIcon className="h-6 w-6" />
                            <span className="font-semibold">{user.name}</span>
                        </div>
                        <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-semibold p-2 rounded-lg hover:bg-red-100">
                           <span>Sair</span>
                           <LogoutIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => handleNavClick('auth')}
                        className="w-full bg-[#EF7669] text-white font-semibold py-3 rounded-lg hover:bg-[#E65F4C] shadow"
                    >
                        Login / Criar Conta
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;