
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
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="flex justify-between items-center p-4 cursor-pointer" style={{ backgroundColor: '#F9FAFB', borderBottom: isOpen ? '1px solid #E5E7EB' : 'none' }} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4 flex-grow flex-wrap">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{room.name}</h3>
            <div className="flex items-center gap-2">
                <input
                    id={`sqm-${room.id}`}
                    type="number"
                    value={room.squareMeters || ''}
                    onChange={(e) => onUpdate(room.id, 'squareMeters', parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                    className="input-field"
                    style={{ width: '6rem', padding: '0.4rem', fontSize: '0.875rem' }}
                    placeholder="0.00"
                />
                <label htmlFor={`sqm-${room.id}`} className="data-label">
                    m²
                </label>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="icon-btn-remove">
                <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            <ChevronDownIcon style={{ width: '1.5rem', height: '1.5rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </div>

      {isOpen && (
        <div className="p-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Repairs */}
            <div className="card" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-sub-data)', marginBottom: '0.75rem' }}>Reparos/Tarefas</h4>
              <div className="space-y-3">
                  {room.repairs.map(item => (
                    <div key={item.id} className="flex justify-between items-center card" style={{ padding: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                        <input type="checkbox" checked={item.completed} onChange={() => toggleRepair(item.id)} style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent)' }} />
                        <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--color-sub-data)' : 'var(--color-text-dark)' }}>{item.description}</span>
                      </label>
                      <button onClick={() => handleRemoveItem('repairs', item.id)} className="icon-btn-remove" style={{ padding: '0.25rem' }}><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                    </div>
                  ))}
              </div>
              <form onSubmit={e => { e.preventDefault(); handleAddItem('repairs', { id: Date.now().toString(), description: newRepair, completed: false }); setNewRepair(''); }} className="flex gap-2" style={{ marginTop: '1rem' }}>
                <input value={newRepair} onChange={e => setNewRepair(e.target.value)} className="input-field" style={{ flexGrow: 1, padding: '0.5rem' }} placeholder="Nova tarefa" />
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem', width: '2rem', height: '2rem' }}><PlusIcon style={{ width: '1rem', height: '1rem' }}/></button>
              </form>
            </div>

            {/* Materials */}
            <div className="card" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-sub-data)', marginBottom: '0.75rem' }}>Materiais</h4>
              <div className="space-y-3">
                  {room.materials.map(item => (
                    <div key={item.id} className="flex justify-between items-center card" style={{ padding: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div className="data-label" style={{ fontSize: '0.75rem' }}>{item.quantity}x {formatCurrency(item.unitPrice)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700 }}>{formatCurrency(item.quantity * item.unitPrice)}</span>
                        <button onClick={() => handleRemoveItem('materials', item.id)} className="icon-btn-remove" style={{ padding: '0.25rem' }}><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                      </div>
                    </div>
                  ))}
              </div>
               <form onSubmit={e => { e.preventDefault(); handleAddItem('materials', { id: Date.now().toString(), ...newMaterial }); setNewMaterial({ name: '', quantity: 1, unitPrice: 0 }); }} className="flex flex-wrap gap-2" style={{ marginTop: '1rem' }}>
                  <input value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="input-field" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Item" />
                  <input value={newMaterial.quantity} onChange={e => setNewMaterial({...newMaterial, quantity: parseInt(e.target.value) || 1})} type="number" className="input-field" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Qtd" />
                  <input value={newMaterial.unitPrice} onChange={e => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value) || 0})} type="number" className="input-field" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Preço" />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem', width: '2rem', height: '2rem' }}><PlusIcon style={{ width: '1rem', height: '1rem' }}/></button>
              </form>
              <div style={{ textAlign: 'right', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid #E0E0E0' }}>Total: {formatCurrency(totalMaterials)}</div>
            </div>
            
            {/* Labor */}
            <div className="card" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none' }}>
              <h4 style={{ fontWeight: 600, color: 'var(--color-sub-data)', marginBottom: '0.75rem' }}>Mão de Obra</h4>
              <div className="space-y-3">
                  {room.labor.map(item => (
                    <div key={item.id} className="flex justify-between items-center card" style={{ padding: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.providerName}</div>
                        <div className="data-label" style={{ fontSize: '0.75rem' }}>{item.phone}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700 }}>{formatCurrency(item.price)}</span>
                        <button onClick={() => handleRemoveItem('labor', item.id)} className="icon-btn-remove" style={{ padding: '0.25rem' }}><TrashIcon style={{ width: '1rem', height: '1rem' }} /></button>
                      </div>
                    </div>
                  ))}
              </div>
               <form onSubmit={e => { e.preventDefault(); handleAddItem('labor', { id: Date.now().toString(), ...newLabor }); setNewLabor({ providerName: '', phone: '', price: 0 }); }} className="space-y-2" style={{ marginTop: '1rem' }}>
                  <input value={newLabor.providerName} onChange={e => setNewLabor({...newLabor, providerName: e.target.value})} className="input-field" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Prestador" />
                  <input value={newLabor.phone} onChange={e => setNewLabor({...newLabor, phone: e.target.value})} className="input-field" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Telefone" />
                  <div className="flex gap-2">
                  <input value={newLabor.price} onChange={e => setNewLabor({...newLabor, price: parseFloat(e.target.value) || 0})} type="number" className="input-field" style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.875rem' }} placeholder="Preço" />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem', width: '2rem', height: '2rem' }}><PlusIcon style={{ width: '1rem', height: '1rem' }}/></button>
                  </div>
              </form>
              <div style={{ textAlign: 'right', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid #E0E0E0' }}>Total: {formatCurrency(totalLabor)}</div>
            </div>
          </div>
      )}
      <div style={{ padding: '1rem', backgroundColor: '#E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, borderTop: '1px solid #D1D5DB' }}>
          <span style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>Total do Cômodo:</span>
          <span style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }}>{formatCurrency(totalRoomCost)}</span>
      </div>
    </div>
  );
};

export default RoomDetail;