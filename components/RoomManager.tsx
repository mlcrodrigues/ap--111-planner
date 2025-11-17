
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
       <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-slate-700">Gerenciador de Cômodos</h2>
          <div className="flex items-center gap-4">
            <div className="text-right bg-slate-50 p-3 rounded-lg">
              <span className="text-slate-500 font-medium text-sm">Custo Total da Obra</span>
              <p className="text-2xl font-bold text-[#EF7669]">{formatCurrency(totalProjectCost)}</p>
            </div>
            <div className="text-right bg-slate-50 p-3 rounded-lg">
              <span className="text-slate-500 font-medium text-sm">Área Total do Imóvel</span>
              <p className="text-2xl font-bold text-[#EF7669]">{totalSquareMeters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleAddRoom} className="flex items-center gap-4">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EF7669] focus:border-[#EF7669]"
            placeholder="Nome do novo cômodo (ex: Quarto do Bebê)"
          />
          <button type="submit" className="flex items-center gap-2 bg-[#EF7669] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#E65F4C] shadow transition-all transform hover:scale-105">
            <PlusIcon />
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
