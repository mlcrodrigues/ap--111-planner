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

const getStatus = (dueDay: number): { text: string, color: string, iconColor: string } => {
  const today = new Date();
  const currentDay = today.getDate();
  
  if (currentDay > dueDay) {
    return { text: `Venceu dia ${dueDay}`, color: 'bg-red-50 border-red-400', iconColor: 'text-red-500' };
  }
  
  const daysRemaining = dueDay - currentDay;
  if (daysRemaining <= 7 && daysRemaining >= 0) {
     if (daysRemaining === 0) return { text: `Vence hoje`, color: 'bg-yellow-50 border-yellow-400', iconColor: 'text-yellow-500' };
     if (daysRemaining === 1) return { text: `Vence amanhã`, color: 'bg-yellow-50 border-yellow-400', iconColor: 'text-yellow-500' };
    return { text: `Vence em ${daysRemaining} dias`, color: 'bg-yellow-50 border-yellow-400', iconColor: 'text-yellow-500' };
  }

  return { text: `Vence dia ${dueDay}`, color: 'bg-green-50 border-green-400', iconColor: 'text-green-500' };
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

  const commonInputClass = "w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669]";

  return (
    <div className="animate-fade-in">
       <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-700">Adicionar Conta Recorrente</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-500 block mb-1">Descrição</label>
            <input type="text" placeholder="Ex: Internet" value={newCost.name} onChange={e => setNewCost({...newCost, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-1">Valor (R$)</label>
            <input type="number" placeholder="0.00" value={newCost.value || ''} onChange={e => setNewCost({...newCost, value: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required/>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label className="text-sm font-medium text-slate-500 block mb-1">Dia Venc.</label>
              <input type="number" min="1" max="31" value={newCost.dueDay} onChange={e => setNewCost({...newCost, dueDay: parseInt(e.target.value) || 1})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required/>
            </div>
            <button type="submit" className="bg-[#EF7669] text-white p-2 rounded-full hover:bg-[#E65F4C] shadow transition-transform transform hover:scale-105 h-[42px] w-[42px] flex-shrink-0">
              <PlusIcon />
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-700 col-span-full">Contas do Mês</h2>
        {costs.sort((a, b) => a.dueDay - b.dueDay).map(cost => {
            const status = getStatus(cost.dueDay);
            return (
                <div key={cost.id} className={`p-4 rounded-xl shadow-md border-l-4 transition-all ${status.color}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-slate-500 block mb-1">Descrição</label>
                            <input
                                type="text"
                                value={cost.name}
                                onChange={(e) => onUpdate(cost.id, 'name', e.target.value)}
                                className={commonInputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 block mb-1">Valor</label>
                             <input
                                type="number"
                                value={cost.value}
                                onChange={(e) => onUpdate(cost.id, 'value', parseFloat(e.target.value) || 0)}
                                className={commonInputClass}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                           <div className="flex-grow">
                                <label className="text-xs font-medium text-slate-500 block mb-1">Dia Venc.</label>
                                <input
                                    type="number"
                                    min="1" max="31"
                                    value={cost.dueDay}
                                    onChange={(e) => onUpdate(cost.id, 'dueDay', parseInt(e.target.value) || 1)}
                                    className={commonInputClass}
                                />
                           </div>
                            <button onClick={() => onRemove(cost.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 h-[42px] w-[42px] flex-shrink-0">
                               <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${status.iconColor}`}>
                        <BellIcon className="h-5 w-5" />
                        <span>{status.text}</span>
                    </div>
                </div>
            )
        })}
         {costs.length === 0 && (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <p className="text-slate-500">Nenhuma conta recorrente registrada. Adicione uma acima!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillAlerts;
