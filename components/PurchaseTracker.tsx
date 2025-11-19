import React, { useState, useMemo } from 'react';
import { PurchaseItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// Ícones SVG Inline (Simplificados para o exemplo)
const StoreIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM9 9h6M9 15h6"/></svg>;
const CreditCardIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;

interface PurchaseTrackerProps {
  purchases: PurchaseItem[];
  onAdd: (purchase: Omit<PurchaseItem, 'id'>) => void;
  onRemove: (id: string) => void;
  paymentMethods: string[];
  onAddPaymentMethod: (method: string) => void;
}

const PurchaseTracker: React.FC<PurchaseTrackerProps> = ({ purchases, onAdd, onRemove, paymentMethods }) => {
  const [newItem, setNewItem] = useState({
    itemName: '',
    store: '',
    price: '',
    paymentMethod: paymentMethods[0] || '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.itemName && newItem.price) {
      onAdd({
        ...newItem,
        price: parseFloat(newItem.price),
      });
      setNewItem({ ...newItem, itemName: '', price: '' }); // Limpa campos principais
    }
  };

  const grandTotal = useMemo(() => purchases.reduce((acc, p) => acc + p.price, 0), [purchases]);

  return (
    <div className="animate-fade-in">
      <div className="card">
        <h2 className="section-title">Nova Compra</h2>
        <form onSubmit={handleAdd}>
            <div className="form-row">
                <div className="input-group">
                    <label className="input-label">O que você comprou?</label>
                    <input className="input-field" placeholder="Ex: Sofá Retrátil" value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} required />
                </div>
            </div>
            
            <div className="form-row two-cols">
                <div className="input-group">
                    <label className="input-label">Loja</label>
                    <input className="input-field" placeholder="Ex: Mobly" value={newItem.store} onChange={e => setNewItem({...newItem, store: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label className="input-label">Data</label>
                    <input type="date" className="input-field" value={newItem.purchaseDate} onChange={e => setNewItem({...newItem, purchaseDate: e.target.value})} required />
                </div>
            </div>

            <div className="form-row two-cols">
                <div className="input-group">
                    <label className="input-label">Preço (R$)</label>
                    <input type="number" className="input-field" placeholder="0.00" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label className="input-label">Pagamento</label>
                    <select className="input-field" value={newItem.paymentMethod} onChange={e => setNewItem({...newItem, paymentMethod: e.target.value})}>
                        {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                <PlusIcon style={{ width: '1.2rem' }}/> Adicionar Compra
            </button>
        </form>
      </div>

      {/* LISTA SIMPLES */}
      <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Histórico</h2>
            <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {purchases.map(item => (
              <div key={item.id} className="list-item">
                  <div className="list-item-content">
                      <div>
                          <div style={{ fontWeight: '700', color: 'var(--color-text-dark)' }}>{item.itemName}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{item.store} • {item.paymentMethod}</div>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="icon-btn-remove"><TrashIcon style={{ width: '1.2rem' }}/></button>
              </div>
          ))}
      </div>
    </div>
  );
};

export default PurchaseTracker;