import React, { useState, useMemo } from 'react';
import { PurchaseItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// Icons for view modes (Mantendo os SVGs simples para facilitar a portabilidade)
const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>
);
const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v6a2 2 0 002 2h12a2 2 0 002-2V9zm-7 4a1 1 0 100 2h4a1 1 0 100-2h-4z" clipRule="evenodd" /></svg>
);
const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
);
const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
);

interface PurchaseTrackerProps {
  purchases: PurchaseItem[];
  onAdd: (purchase: Omit<PurchaseItem, 'id'>) => void;
  onRemove: (id: string) => void;
  paymentMethods: string[];
  onAddPaymentMethod: (method: string) => void;
}

type GroupBy = 'store' | 'payment' | 'date' | 'list';

const PurchaseTracker: React.FC<PurchaseTrackerProps> = ({ purchases, onAdd, onRemove, paymentMethods, onAddPaymentMethod }) => {
  const [newItem, setNewItem] = useState({
    itemName: '',
    store: '',
    price: 0,
    paymentMethod: paymentMethods[0] || '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [viewMode, setViewMode] = useState<GroupBy>('store');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const handleAddPaymentMethod = () => {
    const trimmedMethod = newPaymentMethod.trim();
    if (trimmedMethod) {
      onAddPaymentMethod(trimmedMethod);
      setNewItem(prev => ({ ...prev, paymentMethod: trimmedMethod }));
      setNewPaymentMethod('');
    }
  };

  const grandTotal = useMemo(() => {
    return purchases.reduce((acc, purchase) => acc + purchase.price, 0);
  }, [purchases]);

  const groupedData = useMemo(() => {
    if (viewMode === 'list') {
      return [...purchases].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    }

    type GroupedPurchases = Record<string, { items: PurchaseItem[], total: number }>;

    const keySelector = (purchase: PurchaseItem): string => {
      switch(viewMode) {
        case 'store':
          return purchase.store || 'Outros';
        case 'payment':
          return purchase.paymentMethod || 'Não especificado';
        case 'date':
          const date = new Date(purchase.purchaseDate);
          const userTimezoneOffset = date.getTimezoneOffset() * 60000;
          const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
          return adjustedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
      }
      return '';
    };

    return purchases.reduce((acc: GroupedPurchases, purchase) => {
      const key = keySelector(purchase);
      if (!acc[key]) {
        acc[key] = { items: [], total: 0 };
      }
      acc[key].items.push(purchase);
      acc[key].total += purchase.price;
      return acc;
    }, {} as GroupedPurchases);
  }, [purchases, viewMode]);

  const sortedGroupKeys = useMemo(() => {
    if (viewMode === 'list' || !groupedData) return [];
    const data = groupedData as Record<string, { items: PurchaseItem[], total: number }>;
    const keys = Object.keys(data);
    if (viewMode === 'date') {
      // Ordenação correta para meses (de mais recente para mais antigo)
      const monthOrder = ['dezembro', 'novembro', 'outubro', 'setembro', 'agosto', 'julho', 'junho', 'maio', 'abril', 'março', 'fevereiro', 'janeiro'];
      return keys.sort((a, b) => {
        const [monthA, yearA] = a.toLowerCase().split(' de ');
        const [monthB, yearB] = b.toLowerCase().split(' de ');
        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
        return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
      });
    }
    return keys.sort((a,b) => a.localeCompare(b));
  }, [groupedData, viewMode]);


  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.itemName.trim() && newItem.store.trim() && newItem.price > 0 && newItem.purchaseDate) {
      onAdd(newItem);
      setNewItem({
        itemName: '', store: '', price: 0,
        paymentMethod: paymentMethods[0] || '',
        purchaseDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR');
  };
  
  const ViewButton: React.FC<{ mode: GroupBy, label: string, icon: React.ReactNode }> = ({ mode, label, icon }) => (
    <button
      onClick={() => setViewMode(mode)}
      // Classes puras simulando Tailwind
      className={`btn-secondary flex items-center gap-2 ${
        viewMode === mode ? 'active-view-btn' : ''
      }`}
      style={{ 
        backgroundColor: viewMode === mode ? 'var(--color-accent)' : '#F3F4F6', 
        color: viewMode === mode ? 'white' : 'var(--color-text-dark)',
        fontWeight: 600,
        boxShadow: viewMode === mode ? '0 2px 4px rgba(255, 107, 107, 0.4)' : 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px'
      }}
    >
      {icon}
      <span style={{ display: 'inline' }}>{label}</span>
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="card mb-6">
        <h2 className="section-title" style={{ margin: 0 }}>Adicionar Nova Compra</h2>
        <form onSubmit={handleAdd} className="space-y-4" style={{ marginTop: '1.5rem' }}>
          {/* Primeira Linha de Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Item</label>
              <input type="text" placeholder="Ex: Sofá" value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Loja</label>
              <input type="text" placeholder="Ex: Mobly" value={newItem.store} onChange={e => setNewItem({...newItem, store: e.target.value})} className="input-field" required/>
            </div>
            <div>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Data</label>
              <input type="date" value={newItem.purchaseDate} onChange={e => setNewItem({...newItem, purchaseDate: e.target.value})} className="input-field" required/>
            </div>
          </div>
          
          {/* Segunda Linha de Inputs e Botão */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Preço (R$)</label>
              <input type="number" step="0.01" placeholder="0.00" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})} className="input-field" required/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="data-label" style={{ marginBottom: '0.25rem' }}>Forma de Pagamento</label>
              <div className="flex gap-2">
                <select value={newItem.paymentMethod} onChange={e => setNewItem({...newItem, paymentMethod: e.target.value})} className="input-field" style={{ flexGrow: 1, height: '42px', padding: '0.5rem' }}>
                    {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                </select>
                <input type="text" value={newPaymentMethod} onChange={e => setNewPaymentMethod(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddPaymentMethod()} placeholder="Nova..." className="input-field" style={{ width: '7rem', padding: '0.5rem' }}/>
                <button type="button" onClick={handleAddPaymentMethod} className="btn-secondary" style={{ height: '42px', padding: '0.5rem', width: '42px', flexShrink: 0 }}><PlusIcon style={{ width: '1.25rem', height: '1.25rem' }}/></button>
              </div>
            </div>
            <div className="flex justify-start">
              <button type="submit" className="btn-primary" style={{ height: '42px', width: '100%', padding: '0.75rem 1rem' }}>
                  <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }}/>
                  <span>Adicionar</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
           <div className="flex items-center gap-4">
            <h2 className="section-title" style={{ margin: 0 }}>Histórico de Compras</h2>
            <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.25rem', backgroundColor: '#F9FAFB', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex gap-2" style={{ backgroundColor: '#F3F4F6', padding: '0.25rem', borderRadius: '8px' }}>
              <ViewButton mode="store" label="Loja" icon={<StoreIcon style={{ width: '1.25rem', height: '1.25rem' }}/>} />
              <ViewButton mode="payment" label="Pagamento" icon={<CreditCardIcon style={{ width: '1.25rem', height: '1.25rem' }}/>} />
              <ViewButton mode="date" label="Mês" icon={<CalendarIcon style={{ width: '1.25rem', height: '1.25rem' }}/>} />
              <ViewButton mode="list" label="Lista" icon={<ListIcon style={{ width: '1.25rem', height: '1.25rem' }}/>} />
          </div>
        </div>

        {/* Listagem de Dados Agrupados ou em Lista */}
        {viewMode === 'list' ? (
          <div className="card">
             <div className="data-header-grid"> {/* Nova classe para cabeçalho da lista */}
                <div style={{ gridColumn: 'span 4' }}>Item/Loja</div>
                <div style={{ gridColumn: 'span 2' }}>Data</div>
                <div style={{ gridColumn: 'span 2' }}>Pagamento</div>
                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Preço</div>
            </div>
            <div className="divide-y-list"> {/* Nova classe para divisórias */}
              {(groupedData as PurchaseItem[]).map(item => (
                <div key={item.id} className="data-row-grid">
                  <div style={{ gridColumn: 'span 4' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{item.itemName}</p>
                    <p className="data-label">{item.store}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2', fontSize: '0.875rem' }}>{formatDate(item.purchaseDate)}</div>
                  <div style={{ gridColumn: 'span 2', fontSize: '0.875rem' }}>{item.paymentMethod}</div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                     <p style={{ fontWeight: 500, color: 'var(--color-text-dark)' }}>{formatCurrency(item.price)}</p>
                     <button onClick={() => onRemove(item.id)} className="icon-btn-remove" style={{ padding: '0.25rem' }}>
                        <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          sortedGroupKeys.map(group => {
            const data = (groupedData as Record<string, { items: PurchaseItem[], total: number }>)[group];
            return (
              <div key={group} className="card">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{group}</h3>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-accent)' }}>{formatCurrency(data.total)}</div>
                </div>
                <div className="divide-y-list">
                  {data.items.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(item => (
                    <div key={item.id} className="data-row-details">
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontWeight: 600 }}>{item.itemName}</p>
                        <p className="data-label">
                          {viewMode === 'payment' && `em ${item.store}`}
                          {viewMode !== 'payment' && `${item.paymentMethod}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 justify-end">
                        <p style={{ fontWeight: 500, color: 'var(--color-sub-data)' }}>{formatCurrency(item.price)}</p>
                        <button onClick={() => onRemove(item.id)} className="icon-btn-remove" style={{ padding: '0.25rem' }}>
                          <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
        
        {purchases.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p className="data-label">Nenhuma compra registrada ainda. Adicione uma acima!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseTracker;