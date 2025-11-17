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

const getStatus = (dueDay: number): { text: string, statusClass: string, iconColorClass: string } => {
  const today = new Date();
  const currentDay = today.getDate();
  
  if (currentDay > dueDay) {
    return { text: `Venceu dia ${dueDay}`, statusClass: 'status-danger', iconColorClass: 'text-danger' };
  }
  
  const daysRemaining = dueDay - currentDay;
  if (daysRemaining <= 7 && daysRemaining >= 0) {
     if (daysRemaining === 0) return { text: `Vence hoje`, statusClass: 'status-warning', iconColorClass: 'text-warning' };
     if (daysRemaining === 1) return { text: `Vence amanhã`, statusClass: 'status-warning', iconColorClass: 'text-warning' };
    return { text: `Vence em ${daysRemaining} dias`, statusClass: 'status-warning', iconColorClass: 'text-warning' };
  }

  return { text: `Vence dia ${dueDay}`, statusClass: 'status-success', iconColorClass: 'text-success' };
};


const BillAlerts: React.FC<BillAlertsProps> = ({ costs, onAdd, onRemove, onUpdate }) => {
  const [newCost, setNewCost] = useState({ name: '', value: 0, dueDay: 1 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCost.name.trim() && newCost.value > 0 && newCost.dueDay >= 1 && newCost.dueDay <= 31) {
      onAdd(newCost);
      setNewCost({ name: '', value: 0, dueDay: 1 });
    }
  };

  return (
    <div className="animate-fade-in">
       <div className="card mb-6">
        <h2 className="section-title" style={{ margin: 0 }}>Adicionar Conta Recorrente</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4" style={{ marginTop: '1rem' }}>
          <div style={{ flex: 2 }}>
            <label className="data-label" style={{ marginBottom: '0.25rem' }}>Descrição</label>
            <input type="text" placeholder="Ex: Internet" value={newCost.name} onChange={e => setNewCost({...newCost, name: e.target.value})} className="input-field" required />
          </div>
          <div style={{ flex: 1 }}>
            <label className="data-label" style={{ marginBottom: '0.25rem' }}>Valor (R$)</label>
            <input type="number" placeholder="0.00" value={newCost.value || ''} onChange={e => setNewCost({...newCost, value: parseFloat(e.target.value) || 0})} className="input-field" required/>
          </div>
          <div className="flex items-end gap-2" style={{ flex: 1 }}>
            <div style={{ flexGrow: 1 }}>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Dia Venc.</label>
              <input type="number" min="1" max="31" value={newCost.dueDay} onChange={e => setNewCost({...newCost, dueDay: parseInt(e.target.value) || 1})} className="input-field" required/>
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem', borderRadius: '50%', width: '2.5rem', height: '2.5rem' }}>
              <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }}/>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="section-title">Contas do Mês</h2>
        {costs.sort((a, b) => a.dueDay - b.dueDay).map(cost => {
            const status = getStatus(cost.dueDay);
            return (
                <div key={cost.id} className={`card ${status.statusClass}`} style={{ padding: '1rem' }}>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div style={{ flexGrow: 2 }}>
                            <label className="data-label">Descrição</label>
                            <input
                                type="text"
                                value={cost.name}
                                onChange={(e) => onUpdate(cost.id, 'name', e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label className="data-label">Valor</label>
                             <input
                                type="number"
                                value={cost.value}
                                onChange={(e) => onUpdate(cost.id, 'value', parseFloat(e.target.value) || 0)}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-center gap-2" style={{ flex: 1, minWidth: '100px' }}>
                           <div style={{ flexGrow: 1 }}>
                                <label className="data-label">Dia Venc.</label>
                                <input
                                    type="number"
                                    min="1" max="31"
                                    value={cost.dueDay}
                                    onChange={(e) => onUpdate(cost.id, 'dueDay', parseInt(e.target.value) || 1)}
                                    className="input-field"
                                />
                           </div>
                            <button onClick={() => onRemove(cost.id)} className="icon-btn-remove">
                               <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2`} style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: `var(--color-${status.iconColorClass.replace('text-', '')})` }}>
                        <BellIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        <span>{status.text}</span>
                    </div>
                </div>
            )
        })}
         {costs.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p className="data-label">Nenhuma conta recorrente registrada. Adicione uma acima!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillAlerts;