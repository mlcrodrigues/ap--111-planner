import React from 'react';
import { ChecklistSection } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface MovingChecklistProps {
  sections: ChecklistSection[];
  onToggle: (itemId: string) => void;
}

const MovingChecklist: React.FC<MovingChecklistProps> = ({ sections, onToggle }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-slate-800">Sua Jornada</h2>
      </div>
      
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.id}>
            <h3 className="text-lg font-bold text-slate-500 mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onToggle(item.id)}
                  className={`flex items-center p-4 rounded-xl transition-all cursor-pointer ${
                    item.completed ? 'bg-sky-100' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                   <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 ${
                       item.completed ? 'bg-sky-200' : 'border-2 border-slate-300'
                   }`}>
                    {item.completed && <CheckIcon className="w-4 h-4 text-sky-700" />}
                  </div>
                  <span className={`text-slate-700 ${item.completed ? 'opacity-70' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <button
            className="w-full bg-[#EF7669] text-white font-bold py-4 px-8 rounded-xl text-lg tracking-widest hover:bg-opacity-90 transition-all transform hover:scale-105"
        >
            Marcar como Concluído
        </button>
      </div>
    </div>
  );
};

export default MovingChecklist;