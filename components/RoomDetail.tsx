
import React, { useState, useMemo } from 'react';
import { Room, RepairItem, MaterialItem, LaborItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface RoomDetailProps {
  room: Room;
  onUpdate: <T extends keyof Room>(roomId: string, field: T, data: Room[T]) => void;
  onRemove: () => void;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ room, onUpdate, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  // State for new items
  const [newRepair, setNewRepair] = useState('');
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 1, unitPrice: 0 });
  const [newLabor, setNewLabor] = useState({ providerName: '', phone: '', price: 0 });

  const totalMaterials = useMemo(() => 
    room.materials.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
    [room.materials]
  );
  const totalLabor = useMemo(() => 
    room.labor.reduce((acc, item) => acc + item.price, 0),
    [room.labor]
  );
  
  const totalRoomCost = useMemo(() => totalMaterials + totalLabor, [totalMaterials, totalLabor]);

  const handleAddItem = <T extends 'repairs' | 'materials' | 'labor'>(type: T, newItem: RepairItem | MaterialItem | LaborItem) => {
    onUpdate(room.id, type, [...room[type], newItem] as any);
  };
  
  const handleRemoveItem = <T extends 'repairs' | 'materials' | 'labor'>(type: T, itemId: string) => {
    onUpdate(room.id, type, room[type].filter((item: any) => item.id !== itemId) as any);
  };

  const toggleRepair = (repairId: string) => {
    const updatedRepairs = room.repairs.map(r => r.id === repairId ? { ...r, completed: !r.completed } : r);
    onUpdate(room.id, 'repairs', updatedRepairs);
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4 flex-grow flex-wrap">
            <h3 className="text-xl font-bold text-slate-800">{room.name}</h3>
            <div className="flex items-center gap-2">
                <input
                    id={`sqm-${room.id}`}
                    type="number"
                    value={room.squareMeters || ''}
                    onChange={(e) => onUpdate(room.id, 'squareMeters', parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-24 p-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669]"
                    placeholder="0.00"
                />
                <label htmlFor={`sqm-${room.id}`} className="text-sm font-medium text-slate-600">
                    m²
                </label>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                <TrashIcon />
            </button>
            <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-slow">
            {/* Repairs */}
            <div className="col-span-1 space-y-3 bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-600">Reparos/Tarefas</h4>
              {room.repairs.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={item.completed} onChange={() => toggleRepair(item.id)} className="form-checkbox h-5 w-5 text-[#EF7669] rounded focus:ring-[#E65F4C]" />
                    <span className={item.completed ? 'line-through text-slate-400' : ''}>{item.description}</span>
                  </label>
                  <button onClick={() => handleRemoveItem('repairs', item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="h-4 w-4" /></button>
                </div>
              ))}
              <form onSubmit={e => { e.preventDefault(); handleAddItem('repairs', { id: Date.now().toString(), description: newRepair, completed: false }); setNewRepair(''); }} className="flex gap-2">
                <input value={newRepair} onChange={e => setNewRepair(e.target.value)} className="flex-grow p-1 border rounded text-sm" placeholder="Nova tarefa" />
                <button type="submit" className="bg-[#EF7669] text-white rounded p-1"><PlusIcon className="h-4 w-4"/></button>
              </form>
            </div>

            {/* Materials */}
            <div className="col-span-1 space-y-3 bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-600">Materiais</h4>
              {room.materials.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded">
                  <span>{item.name} ({item.quantity}x {formatCurrency(item.unitPrice)})</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatCurrency(item.quantity * item.unitPrice)}</span>
                    <button onClick={() => handleRemoveItem('materials', item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
               <form onSubmit={e => { e.preventDefault(); handleAddItem('materials', { id: Date.now().toString(), ...newMaterial }); setNewMaterial({ name: '', quantity: 1, unitPrice: 0 }); }} className="grid grid-cols-3 gap-2 text-sm">
                  <input value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="col-span-3 p-1 border rounded" placeholder="Item" />
                  <input value={newMaterial.quantity} onChange={e => setNewMaterial({...newMaterial, quantity: parseInt(e.target.value) || 1})} type="number" className="p-1 border rounded" placeholder="Qtd" />
                  <input value={newMaterial.unitPrice} onChange={e => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value) || 0})} type="number" className="p-1 border rounded" placeholder="Preço" />
                  <button type="submit" className="bg-[#EF7669] text-white rounded p-1 flex justify-center items-center"><PlusIcon className="h-4 w-4"/></button>
              </form>
              <div className="text-right font-bold pt-2 border-t">Total: {formatCurrency(totalMaterials)}</div>
            </div>
            
            {/* Labor */}
            <div className="col-span-1 space-y-3 bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-600">Mão de Obra</h4>
              {room.labor.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded">
                  <div>
                    <div className="font-medium">{item.providerName}</div>
                    <div className="text-sm text-slate-500">{item.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatCurrency(item.price)}</span>
                    <button onClick={() => handleRemoveItem('labor', item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
               <form onSubmit={e => { e.preventDefault(); handleAddItem('labor', { id: Date.now().toString(), ...newLabor }); setNewLabor({ providerName: '', phone: '', price: 0 }); }} className="space-y-2 text-sm">
                  <input value={newLabor.providerName} onChange={e => setNewLabor({...newLabor, providerName: e.target.value})} className="w-full p-1 border rounded" placeholder="Prestador" />
                  <input value={newLabor.phone} onChange={e => setNewLabor({...newLabor, phone: e.target.value})} className="w-full p-1 border rounded" placeholder="Telefone" />
                  <div className="flex gap-2">
                  <input value={newLabor.price} onChange={e => setNewLabor({...newLabor, price: parseFloat(e.target.value) || 0})} type="number" className="flex-grow p-1 border rounded" placeholder="Preço" />
                  <button type="submit" className="bg-[#EF7669] text-white rounded p-1 flex justify-center items-center w-8"><PlusIcon className="h-4 w-4"/></button>
                  </div>
              </form>
              <div className="text-right font-bold pt-2 border-t">Total: {formatCurrency(totalLabor)}</div>
            </div>
          </div>
          <div className="p-4 bg-slate-100 flex justify-between items-center font-bold border-t">
              <span className="text-slate-600 text-lg">Total do Cômodo:</span>
              <span className="text-xl text-[#EF7669]">{formatCurrency(totalRoomCost)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomDetail;
