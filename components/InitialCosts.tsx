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

const getStatusColor = (dueDate: string): string => {
  if (!dueDate) return ''; // Sem status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0,0,0,0); 
  const timeDiff = due.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (dayDiff < 0) return 'status-danger'; // Vencido
  if (dayDiff <= 7) return 'status-warning'; // Vence em 7 dias
  return ''; // OK (sem borda)
};


const InitialCosts: React.FC<InitialCostsProps> = ({ costs, onUpdate, onAdd, onRemove }) => {
  const [newCostName, setNewCostName] = useState('');

  const total = useMemo(() => {
    return costs.reduce((acc, cost) => acc + cost.value, 0);
  }, [costs]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCostName.trim()) {
      onAdd(newCostName.trim());
      setNewCostName('');
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="section-title" style={{ margin: 0 }}>Custos Iniciais</h2>
      </div>
      
      <div className="space-y-4">
        {costs.map(cost => (
          // Usando Grid e classes de status puras
          <div key={cost.id} className={`flex items-center p-3 rounded-lg hover-bg-light transition-colors ${getStatusColor(cost.dueDate)}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{cost.name}</span>
            <div>
              <label className="data-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Valor</label>
              <input
                type="number"
                value={cost.value}
                onChange={(e) => onUpdate(cost.id, parseFloat(e.target.value) || 0, cost.dueDate)}
                className="input-field"
                style={{ padding: '0.5rem' }}
                placeholder="0.00"
              />
            </div>
            <div>
               <label className="data-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Venc.</label>
              <input
                type="date"
                value={cost.dueDate}
                onChange={(e) => onUpdate(cost.id, cost.value, e.target.value)}
                className="input-field"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div className="flex justify-end items-center">
              <button onClick={() => onRemove(cost.id)} className="icon-btn-remove">
                <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleAdd} className="flex items-center gap-4" style={{ marginTop: '1.5rem', padding: '0.5rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
        <input
          type="text"
          value={newCostName}
          onChange={(e) => setNewCostName(e.target.value)}
          className="input-field"
          style={{ flexGrow: 1, padding: '0.5rem' }}
          placeholder="Novo custo..."
        />
        <button type="submit" className="btn-primary" style={{ padding: '0.5rem', borderRadius: '50%', width: '2.5rem', height: '2.5rem' }}>
          <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }}/>
        </button>
      </form>

      <div className="flex justify-between items-center" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #E0E0E0' }}>
        <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--color-sub-data)' }}>Total:</span>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-accent)' }}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
};

export default InitialCosts;