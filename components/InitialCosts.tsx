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
  if (!dueDate) return 'border-transparent';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0,0,0,0); // Adjust for timezone
  const timeDiff = due.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (dayDiff < 0) return 'border-red-500'; // Vencido
  if (dayDiff <= 7) return 'border-yellow-500'; // Vence em 7 dias
  return 'border-transparent'; // OK
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
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-700">Custos Iniciais</h2>
      </div>
      
      <div className="space-y-4">
        {costs.map(cost => (
          <div key={cost.id} className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border-l-4 ${getStatusColor(cost.dueDate)}`}>
            <span className="font-semibold text-slate-600 col-span-1 md:col-span-1">{cost.name}</span>
            <div className="col-span-1 md:col-span-1">
              <label className="text-xs font-medium text-slate-500 block mb-1">Valor</label>
              <input
                type="number"
                value={cost.value}
                onChange={(e) => onUpdate(cost.id, parseFloat(e.target.value) || 0, cost.dueDate)}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669]"
                placeholder="0.00"
              />
            </div>
            <div className="col-span-1 md:col-span-1">
               <label className="text-xs font-medium text-slate-500 block mb-1">Venc.</label>
              <input
                type="date"
                value={cost.dueDate}
                onChange={(e) => onUpdate(cost.id, cost.value, e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]"
              />
            </div>
            <div className="col-span-1 md:col-span-1 flex justify-end">
              <button onClick={() => onRemove(cost.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleAdd} className="mt-6 flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
        <input
          type="text"
          value={newCostName}
          onChange={(e) => setNewCostName(e.target.value)}
          className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]"
          placeholder="Novo custo..."
        />
        <button type="submit" className="bg-[#EF7669] text-white p-2 rounded-full hover:bg-[#E65F4C] shadow transition-transform transform hover:scale-105">
          <PlusIcon />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
        <span className="text-md font-medium text-slate-500">Total:</span>
        <span className="text-xl font-bold text-[#EF7669]">
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </div>
  );
};

export default InitialCosts;