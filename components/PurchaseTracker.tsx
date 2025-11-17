import React, { useState, useMemo } from 'react';
import { PurchaseItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// Icons for view modes
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
      const monthOrder = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
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
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
        viewMode === mode ? 'bg-[#EF7669] text-white shadow' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-700">Adicionar Nova Compra</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-500 block mb-1">Item</label>
              <input type="text" placeholder="Ex: Sofá" value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Loja</label>
              <input type="text" placeholder="Ex: Mobly" value={newItem.store} onChange={e => setNewItem({...newItem, store: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required/>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Data</label>
              <input type="date" value={newItem.purchaseDate} onChange={e => setNewItem({...newItem, purchaseDate: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-slate-500 block mb-1">Preço (R$)</label>
              <input type="number" step="0.01" placeholder="0.00" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669]" required/>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-500 block mb-1">Forma de Pagamento</label>
              <div className="flex gap-2">
                <select value={newItem.paymentMethod} onChange={e => setNewItem({...newItem, paymentMethod: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669] h-[42px]">
                    {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                </select>
                <input type="text" value={newPaymentMethod} onChange={e => setNewPaymentMethod(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddPaymentMethod()} placeholder="Nova..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EF7669] w-28"/>
                <button type="button" onClick={handleAddPaymentMethod} className="bg-slate-200 text-slate-700 p-2 rounded-md hover:bg-slate-300 h-[42px] flex items-center justify-center"><PlusIcon className="h-5 w-5"/></button>
              </div>
            </div>
            <div className="flex justify-start">
              <button type="submit" className="bg-[#EF7669] text-white font-semibold p-2 rounded-lg hover:bg-[#E65F4C] shadow transition-transform transform hover:scale-105 h-[42px] w-full flex items-center justify-center gap-2">
                  <PlusIcon />
                  <span>Adicionar</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-slate-700">Histórico de Compras</h2>
            <span className="font-bold text-[#EF7669] text-xl bg-[#FEF2F0] px-3 py-1 rounded-full">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-lg">
              <ViewButton mode="store" label="Loja" icon={<StoreIcon className="h-5 w-5"/>} />
              <ViewButton mode="payment" label="Pagamento" icon={<CreditCardIcon className="h-5 w-5"/>} />
              <ViewButton mode="date" label="Mês" icon={<CalendarIcon className="h-5 w-5"/>} />
              <ViewButton mode="list" label="Lista" icon={<ListIcon className="h-5 w-5"/>} />
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
             <div className="hidden md:grid md:grid-cols-10 gap-4 items-center pb-3 border-b border-slate-200 font-bold text-slate-500 text-sm uppercase">
                <div className="col-span-4">Item/Loja</div>
                <div className="col-span-2">Data</div>
                <div className="col-span-2">Pagamento</div>
                <div className="col-span-2 text-right">Preço</div>
            </div>
            <div className="divide-y divide-slate-100">
              {(groupedData as PurchaseItem[]).map(item => (
                <div key={item.id} className="py-3 md:grid md:grid-cols-10 md:gap-4 md:items-center">
                  <div className="md:col-span-4">
                    <p className="font-semibold text-slate-800">{item.itemName}</p>
                    <p className="text-sm text-slate-500">{item.store}</p>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-sm text-slate-600">{formatDate(item.purchaseDate)}</div>
                  <div className="hidden md:block md:col-span-2 text-sm text-slate-600">{item.paymentMethod}</div>
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                     <div className="md:hidden text-sm text-slate-600">
                      <span>{formatDate(item.purchaseDate)}</span> &bull; <span>{item.paymentMethod}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-700 text-right whitespace-nowrap">{formatCurrency(item.price)}</p>
                        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          sortedGroupKeys.map(group => {
            const data = (groupedData as Record<string, { items: PurchaseItem[], total: number }>)[group];
            return (
              <div key={group} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{group}</h3>
                  <div className="text-lg font-bold text-[#EF7669]">{formatCurrency(data.total)}</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.items.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(item => (
                    <div key={item.id} className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center py-3">
                      <div className="col-span-2">
                        <p className="font-semibold">{item.itemName}</p>
                        <p className="text-sm text-slate-500">
                          {viewMode !== 'store' && `${item.store}`}
                          {viewMode === 'date' && ` • ${item.paymentMethod}`}
                          {viewMode === 'store' && `${item.paymentMethod}`}
                        </p>
                      </div>
                      <div className="text-sm text-slate-600 hidden sm:block">{formatDate(item.purchaseDate)}</div>
                      <div className="flex items-center gap-4 justify-end">
                        <p className="font-medium text-slate-600 text-right">{formatCurrency(item.price)}</p>
                        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                          <TrashIcon className="h-4 w-4" />
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
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-slate-500">Nenhuma compra registrada ainda. Adicione uma acima!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseTracker;
