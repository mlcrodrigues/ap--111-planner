import React, { useState, useMemo } from 'react';
import { InitialCost } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InitialCostsProps {
  costs: InitialCost[];
  onUpdate: (id: string, value: number, dueDate: string) => void;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

const InitialCosts: React.FC<InitialCostsProps> = ({ costs, onUpdate, onAdd, onRemove }) => {
  const [newCostName, setNewCostName] = useState('');

  const total = useMemo(() => costs.reduce((acc, cost) => acc + cost.value, 0), [costs]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCostName.trim()) {
      onAdd(newCostName.trim());
      setNewCostName('');
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* INPUT RÁPIDO */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
         <input 
            className="input-field" 
            style={{ margin: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}
            placeholder="Adicionar novo custo (ex: ITBI)..."
            value={newCostName}
            onChange={e => setNewCostName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd(e)}
         />
         <button onClick={handleAdd} className="btn-primary btn-icon" style={{ width: '40px', height: '40px' }}>
            <PlusIcon style={{ width: '1.2rem' }}/>
         </button>
      </div>

      {/* LISTA */}
      <div>
        {costs.map(cost => (
          <div key={cost.id} className="list-item">
            <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{cost.name}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Inputs menores e discretos para edição rápida */}
                    <input 
                        type="number" 
                        value={cost.value} 
                        onChange={e => onUpdate(cost.id, parseFloat(e.target.value), cost.dueDate)}
                        className="input-field"
                        style={{ width: '100px', padding: '4px 8px', height: '36px', fontSize: '0.9rem' }}
                        placeholder="R$ 0,00"
                    />
                    <input 
                        type="date" 
                        value={cost.dueDate} 
                        onChange={e => onUpdate(cost.id, cost.value, e.target.value)}
                        className="input-field"
                        style={{ width: '130px', padding: '4px 8px', height: '36px', fontSize: '0.85rem', color: 'var(--color-text-light)' }}
                    />
                </div>
            </div>
            <button onClick={() => onRemove(cost.id)} className="icon-btn-remove">
                <TrashIcon style={{ width: '1.2rem' }} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'right', marginTop: '2rem', padding: '1rem' }}>
        <span style={{ color: 'var(--color-text-light)', marginRight: '1rem' }}>Total Estimado</span>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </div>
  );
};

export default InitialCosts;