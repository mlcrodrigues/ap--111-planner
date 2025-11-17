import React, { useState, useMemo } from 'react';
import { Room } from '../types';
import RoomDetail from './RoomDetail';
import { PlusIcon } from './icons/PlusIcon';

interface RoomManagerProps {
  rooms: Room[];
  onUpdateRoom: <T extends keyof Room>(roomId: string, field: T, data: Room[T]) => void;
  onAddRoom: (name: string) => void;
  onRemoveRoom: (id: string) => void;
}

const RoomManager: React.FC<RoomManagerProps> = ({ rooms, onUpdateRoom, onAddRoom, onRemoveRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');

  const totalSquareMeters = useMemo(() => {
    return rooms.reduce((acc, room) => acc + (room.squareMeters || 0), 0);
  }, [rooms]);

  const totalProjectCost = useMemo(() => {
    return rooms.reduce((total, room) => {
      const materialsTotal = room.materials.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const laborTotal = room.labor.reduce((acc, item) => acc + item.price, 0);
      return total + materialsTotal + laborTotal;
    }, 0);
  }, [rooms]);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onAddRoom(newRoomName.trim());
      setNewRoomName('');
    }
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="card mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h2 className="section-title" style={{ margin: 0 }}>Gerenciador de Cômodos</h2>
          <div className="flex items-center gap-4">
            <div className="card" style={{ padding: '0.75rem', backgroundColor: '#F9FAFB' }}>
              <span className="data-label" style={{ textAlign: 'right' }}>Custo Total da Obra</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{formatCurrency(totalProjectCost)}</p>
            </div>
            <div className="card" style={{ padding: '0.75rem', backgroundColor: '#F9FAFB' }}>
              <span className="data-label" style={{ textAlign: 'right' }}>Área Total do Imóvel</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{totalSquareMeters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleAddRoom} className="flex items-center gap-4">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="input-field"
            style={{ flexGrow: 1 }}
            placeholder="Nome do novo cômodo (ex: Quarto do Bebê)"
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
            <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }}/>
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {rooms.map(room => (
          <RoomDetail 
            key={room.id} 
            room={room} 
            onUpdate={onUpdateRoom}
            onRemove={() => onRemoveRoom(room.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomManager;