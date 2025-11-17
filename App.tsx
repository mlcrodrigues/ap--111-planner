import React, { useState, useCallback } from 'react';
import { db } from './firebase';
import { InitialCost, Room, PurchaseItem, ChecklistSection, RecurringCost, ChecklistItem, User } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InitialCosts from './components/InitialCosts';
import RoomManager from './components/RoomManager';
import PurchaseTracker from './components/PurchaseTracker';
import BillAlerts from './components/BillAlerts';
import MovingChecklist from './components/MovingChecklist';
import Auth from './components/Auth';
import Contact from './components/Contact';
import ShareModal from './components/ShareModal';



export type View = 'dashboard' | 'costs' | 'rooms' | 'purchases' | 'bills' | 'journey' | 'auth' | 'contact';

// --- DADOS INICIAIS ---
const initialChecklistData: ChecklistSection[] = [
  {
    id: 'before',
    title: 'Documentação e Financiamento',
    items: [
      { id: 'c1', text: 'Simular Financiamento', completed: true },
      { id: 'c2', text: 'Análise de Crédito', completed: true },
      { id: 'c3', text: 'Assinar contrato com o banco', completed: false },
      { id: 'c4', text: 'Registrar imóvel no cartório', completed: false },
    ],
  },
  {
    id: 'during',
    title: 'Visitas e Escolha',
    items: [{ id: 'c7', text: 'Visitar Imóveis', completed: false }, { id: 'c8', text: 'Fazer vistoria do imóvel escolhido', completed: false }],
  },
  {
    id: 'after',
    title: 'Pós-Compra',
    items: [{ id: 'c11', text: 'Pegar as chaves', completed: false }, { id: 'c12', text: 'Trocar as fechaduras', completed: false }, { id: 'c13', text: 'Ligar água e luz', completed: false }],
  },
];

const initialCostsData: InitialCost[] = [
    { id: '1', name: 'Entrada', value: 50000, dueDate: '2024-08-15' },
    { id: '2', name: 'Financiamento (1ª Parcela)', value: 2500, dueDate: '2024-09-01' },
    { id: '3', name: 'ITBI', value: 8000, dueDate: '2024-08-20' },
    { id: '4', name: 'Cartório', value: 2000, dueDate: '2024-08-20' },
];

const initialRoomsData: Room[] = [
    { id: 'r1', name: 'Sala de Estar', squareMeters: 20, repairs: [], materials: [{ id: 'm1', name: 'Piso Vinílico', quantity: 20, unitPrice: 80 }], labor: [{ id: 'l1', providerName: 'João Pedreiro', phone: '11987654321', price: 1500 }] },
    { id: 'r2', name: 'Quarto Casal', squareMeters: 12, repairs: [], materials: [], labor: [] },
];

const initialPurchasesData: PurchaseItem[] = [
    { id: 'p1', store: 'Tok&Stok', itemName: 'Sofá 3 lugares', price: 2999.90, paymentMethod: 'Cartão de Crédito', purchaseDate: '2024-07-10' },
    { id: 'p2', store: 'Leroy Merlin', itemName: 'Tinta Branca (18L)', price: 350.00, paymentMethod: 'PIX', purchaseDate: '2024-07-15' },
];

const initialRecurringCostsData: RecurringCost[] = [
    { id: 'rc1', name: 'Condomínio', value: 550, dueDay: 10 },
    { id: 'rc2', name: 'Internet Fibra', value: 99.90, dueDay: 15 },
];


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Estados da aplicação
  const [projectName, setProjectName] = useState('Meu Novo Apê');
  const [user, setUser] = useState<User | null>(null);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [initialCosts, setInitialCosts] = useState<InitialCost[]>(initialCostsData);
  const [rooms, setRooms] = useState<Room[]>(initialRoomsData);
  const [purchases, setPurchases] = useState<PurchaseItem[]>(initialPurchasesData);
  const [recurringCosts, setRecurringCosts] = useState<RecurringCost[]>(initialRecurringCostsData);
  const [checklist, setChecklist] = useState<ChecklistSection[]>(initialChecklistData);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Cartão de Crédito', 'PIX', 'Débito', 'Boleto']);

  // --- HANDLERS ---

  // Custos Iniciais
  const updateInitialCost = useCallback((id: string, value: number, dueDate: string) => {
    setInitialCosts(prev => prev.map(c => c.id === id ? { ...c, value, dueDate } : c));
  }, []);
  const addInitialCost = useCallback((name: string) => {
    setInitialCosts(prev => [...prev, { id: Date.now().toString(), name, value: 0, dueDate: new Date().toISOString().split('T')[0] }]);
  }, []);
  const removeInitialCost = useCallback((id: string) => {
    setInitialCosts(prev => prev.filter(c => c.id !== id));
  }, []);

  // Cômodos
  const updateRoom = useCallback(<T extends keyof Room>(roomId: string, field: T, data: Room[T]) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, [field]: data } : r));
  }, []);
  const addRoom = useCallback((name: string) => {
    setRooms(prev => [...prev, { id: Date.now().toString(), name, squareMeters: 0, repairs: [], materials: [], labor: [] }]);
  }, []);
  const removeRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  }, []);
  
  // Compras
  const addPurchase = useCallback((purchase: Omit<PurchaseItem, 'id'>) => {
    setPurchases(prev => [...prev, { id: Date.now().toString(), ...purchase }]);
  }, []);
  const removePurchase = useCallback((id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  }, []);
  const addPaymentMethod = useCallback((method: string) => {
    if (!paymentMethods.includes(method)) {
      setPaymentMethods(prev => [...prev, method]);
    }
  }, [paymentMethods]);

  // Contas Recorrentes
  const addRecurringCost = useCallback((cost: Omit<RecurringCost, 'id'>) => {
    setRecurringCosts(prev => [...prev, { id: Date.now().toString(), ...cost }]);
  }, []);
  const removeRecurringCost = useCallback((id: string) => {
    setRecurringCosts(prev => prev.filter(rc => rc.id !== id));
  }, []);
  const updateRecurringCost = useCallback((id: string, field: keyof Omit<RecurringCost, 'id'>, value: string | number) => {
    setRecurringCosts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  // Checklist
  const toggleChecklistItem = useCallback((itemId: string) => {
    setChecklist(prev => prev.map(section => ({
      ...section,
      items: section.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
    })));
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  }

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
                sections={checklist} 
                initialCosts={initialCosts}
                rooms={rooms}
                purchases={purchases}
                projectName={projectName}
                setProjectName={setProjectName}
               />;
      case 'costs':
        return <InitialCosts costs={initialCosts} onUpdate={updateInitialCost} onAdd={addInitialCost} onRemove={removeInitialCost} />;
      case 'rooms':
        return <RoomManager rooms={rooms} onUpdateRoom={updateRoom} onAddRoom={addRoom} onRemoveRoom={removeRoom} />;
      case 'purchases':
        return <PurchaseTracker purchases={purchases} onAdd={addPurchase} onRemove={removePurchase} paymentMethods={paymentMethods} onAddPaymentMethod={addPaymentMethod} />;
      case 'bills':
        return <BillAlerts costs={recurringCosts} onAdd={addRecurringCost} onRemove={removeRecurringCost} onUpdate={updateRecurringCost} />;
      case 'journey':
        return <MovingChecklist sections={checklist} onToggle={toggleChecklistItem} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'contact':
        return <Contact />;
      default:
        return <Dashboard 
                sections={checklist} 
                initialCosts={initialCosts}
                rooms={rooms}
                purchases={purchases}
                projectName={projectName}
                setProjectName={setProjectName}
              />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onShare={() => setShareModalOpen(true)}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
      {isShareModalOpen && <ShareModal onClose={() => setShareModalOpen(false)} projectName={projectName}/>}
    </div>
  );
};

export default App;