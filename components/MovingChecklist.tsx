import React from 'react';
import { ChecklistSection } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface MovingChecklistProps {
  sections: ChecklistSection[];
  onToggle: (itemId: string) => void;
}

const MovingChecklist: React.FC<MovingChecklistProps> = ({ sections, onToggle }) => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2.5rem auto' }}>
      <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>Sua Jornada</h2>
      </div>
      
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.id} className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>{section.title}</h3>
            <div className="space-y-3">
              {section.items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onToggle(item.id)}
                  className={`flex items-center p-4 rounded-xl transition-all cursor-pointer ${
                    item.completed ? 'completed-item' : 'pending-item'
                  }`}
                  style={{ 
                    backgroundColor: item.completed ? '#EBF2FA' : 'var(--color-background-card)', 
                    borderLeft: item.completed ? '4px solid var(--color-accent)' : '1px solid #E0E0E0'
                  }}
                >
                   <div style={{ flexShrink: 0, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', 
                       backgroundColor: item.completed ? 'var(--color-accent)' : 'white', border: item.completed ? 'none' : '2px solid var(--color-sub-data)'
                   }}>
                    {item.completed && <CheckIcon style={{ width: '1rem', height: '1rem', color: 'white' }} />}
                  </div>
                  <span style={{ color: 'var(--color-text-dark)', opacity: item.completed ? 0.6 : 1 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ paddingTop: '1rem', marginTop: '2rem' }}>
        <button
            className="btn-primary"
            style={{ width: '100%', padding: '1rem 2rem', fontSize: '1.125rem', letterSpacing: '0.1em' }}
        >
            Marcar como Concluído
        </button>
      </div>
    </div>
  );
};

export default MovingChecklist;