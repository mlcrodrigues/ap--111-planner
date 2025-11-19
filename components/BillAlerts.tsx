import React, { useState } from 'react';
import { RecurringCost } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BellIcon } from './icons/BellIcon';

interface BillAlertsProps {
  costs: RecurringCost[];
  onAdd: (cost: Omit<RecurringCost, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Omit<RecurringCost, 'id'>, value: string | number) => void;
}

const getStatus = (dueDay: number) => {
  const today = new Date();
  const currentDay = today.getDate();
  
  if (currentDay > dueDay) return { text: `Venceu dia ${dueDay}`, color: 'var(--color-danger)' };
  const daysRemaining = dueDay - currentDay;
  if (daysRemaining <= 7 && daysRemaining >= 0) return { text: `Vence em ${daysRemaining} dias`, color: 'var(--color-warning)' };
  return { text: `Vence dia ${dueDay}`, color: 'var(--color-success)' };
};

const BillAlerts: React.FC<BillAlertsProps> = ({ costs, onAdd, onRemove, onUpdate }) => {
  const [newCost, setNewCost] = useState({ name: '', value: '', dueDay: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCost.name && newCost.value && newCost.dueDay) {
      onAdd({
        name: newCost.name,
        value: parseFloat(newCost.value),
        dueDay: parseInt(newCost.dueDay)
      });
      setNewCost({ name: '', value: '', dueDay: '' });
    }
  };

  return (
    <div className="animate-fade-in">
       {/* CARD DE ADIÇÃO */}
       <div className="card">
        <h2 className="section-title">Adicionar Conta Recorrente</h2>
        
        <form onSubmit={handleAdd}>
            {/* Linha 1: Descrição (ocupa tudo) */}
            <div className="form-row">
                <div className="input-group">
                    <label className="input-label">Descrição</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Internet, Condomínio" 
                        value={newCost.name} 
                        onChange={e => setNewCost({...newCost, name: e.target.value})} 
                        className="input-field" 
                        required 
                    />
                </div>
            </div>

            {/* Linha 2: Valor e Dia + Botão */}
            <div className="form-row three-cols" style={{ alignItems: 'end' }}>
                <div className="input-group">
                    <label className="input-label">Valor (R$)</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        value={newCost.value} 
                        onChange={e => setNewCost({...newCost, value: e.target.value})} 
                        className="input-field" 
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Dia Venc.</label>
                    <input 
                        type="number" 
                        min="1" max="31" 
                        value={newCost.dueDay} 
                        onChange={e => setNewCost({...newCost, dueDay: e.target.value})} 
                        className="input-field" 
                        required
                    />
                </div>
                <button type="submit" className="btn-primary btn-icon">
                    <PlusIcon style={{ width: '1.5rem', height: '1.5rem' }}/>
                </button>
            </div>
        </form>
      </div>

      {/* LISTA DE CONTAS */}
      <div className="space-y-4">
        <h2 className="section-title" style={{ marginTop: '2rem' }}>Contas do Mês</h2>
        
        {costs.sort((a, b) => a.dueDay - b.dueDay).map(cost => {
            const status = getStatus(cost.dueDay);
            return (
                <div key={cost.id} className="list-item">
                    <div className="list-item-content">
                        <div>
                            <p style={{ fontWeight: 700, color: 'var(--color-text-dark)' }}>{cost.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <BellIcon style={{ width: '0.9rem', color: status.color }} />
                                <span style={{ fontSize: '0.8rem', color: status.color, fontWeight: 600 }}>{status.text}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                             <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                                {cost.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                             </p>
                        </div>
                    </div>
                    <button onClick={() => onRemove(cost.id)} className="icon-btn-remove">
                        <TrashIcon style={{ width: '1.2rem' }} />
                    </button>
                </div>
            )
        })}
        
        {costs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                Nenhuma conta cadastrada.
            </div>
        )}
      </div>
    </div>
  );
};

export default BillAlerts;