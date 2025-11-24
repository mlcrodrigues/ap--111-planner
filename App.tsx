import React, { useState, useCallback, useEffect } from 'react';
import { InitialCost, Room, PurchaseItem, ChecklistSection, RecurringCost, User } from './types';
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
import { loadUserData, saveItem, deleteItem, saveProjectName, saveChecklistSection } from './firestoreService';

// --- DADOS INICIAIS (Fallback para quando não houver usuário logado) ---
const defaultChecklistData: ChecklistSection[] = [
  {
    id: 'before',
    title: 'Documentação e Financiamento',
    items: [
      { id: 'c1', text: 'Simular Financiamento', completed: false },
      { id: 'c2', text: 'Análise de Crédito', completed: false },
      { id: 'c3', text: 'Assinar contrato com o banco', completed: false },
      { id: 'c4', text: 'Registrar imóvel no cartório', completed: false },
    ],
  },
  {
    id: 'during',
    title: 'Visitas e Escolha',
    items: [{ id: 'c7', text: 'Visitar Imóveis', completed: false }, { id: 'c8', text: 'Fazer vistoria', completed: false }],
  },
  {
    id: 'after',
    title: 'Pós-Compra',
    items: [{ id: 'c11', text: 'Pegar as chaves', completed: false }, { id: 'c12', text: 'Trocar as fechaduras', completed: false }],
  },
];

export type View = 'dashboard' | 'costs' | 'rooms' | 'purchases' | 'bills' | 'journey' | 'auth' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Estados
  const [projectName, setProjectName] = useState('Meu Novo Apê');
  const [user, setUser] = useState<User | null>(null);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  // Dados (Inicializamos vazios para carregar do DB ou usar defaults)
  const [initialCosts, setInitialCosts] = useState<InitialCost[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [recurringCosts, setRecurringCosts] = useState<RecurringCost[]>([]);
  const [checklist, setChecklist] = useState<ChecklistSection[]>(defaultChecklistData);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Cartão de Crédito', 'PIX', 'Débito', 'Boleto']);

  // --- EFEITO: MONITORAR AUTH E CARREGAR DADOS ---
  useEffect(() => {
    // Importar auth aqui ou usar o importado se eu adicionar no topo. 
    // Como não adicionei no topo ainda, vou assumir que o Auth component lida com o login, 
    // mas para persistência de sessão (refresh), precisamos do onAuthStateChanged.
    // Vou usar o import dinâmico ou assumir que o 'auth' do firebase.ts está disponível se eu importar.
    // VOU ADICIONAR OS IMPORTS NO TOPO EM UM PASSO SEPARADO PARA NÃO QUEBRAR.
    // Por enquanto, vou manter a lógica baseada no estado 'user' que vem do componente Auth,
    // mas vou limpar a lógica de "simulação" que usava email como ID.

    const fetchData = async () => {
      if (user && user.uid) {
        const data = await loadUserData(user.uid);
        if (data) {
          setInitialCosts(data.initialCosts);
          setRooms(data.rooms);
          setPurchases(data.purchases);
          setRecurringCosts(data.recurringCosts);
          if (data.checklist.length > 0) setChecklist(data.checklist);
          if (data.projectName) setProjectName(data.projectName);
        }
      }
    };
    fetchData();
  }, [user]);


  // --- HANDLERS COM PERSISTÊNCIA ---

  // Helper para pegar o ID do usuário de forma segura
  const getUserId = () => user?.uid;

  // 1. Custos Iniciais
  const updateInitialCost = useCallback((id: string, value: number, dueDate: string) => {
    setInitialCosts(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, value, dueDate } : c);
      const item = updated.find(c => c.id === id);
      if (user && item && user.uid) saveItem(user.uid, 'initialCosts', item);
      return updated;
    });
  }, [user]);

  const addInitialCost = useCallback((name: string) => {
    // FIX: Usar ID único melhor que Date.now()
    const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newItem: InitialCost = { id: uniqueId, name, value: 0, dueDate: new Date().toISOString().split('T')[0] };
    setInitialCosts(prev => [...prev, newItem]);
    if (user && user.uid) saveItem(user.uid, 'initialCosts', newItem);
  }, [user]);

  const removeInitialCost = useCallback((id: string) => {
    setInitialCosts(prev => prev.filter(c => c.id !== id));
    if (user && user.uid) deleteItem(user.uid, 'initialCosts', id);
  }, [user]);


  // 2. Cômodos
  const updateRoom = useCallback(<T extends keyof Room>(roomId: string, field: T, data: Room[T]) => {
    setRooms(prev => {
      const updated = prev.map(r => r.id === roomId ? { ...r, [field]: data } : r);
      const item = updated.find(r => r.id === roomId);
      if (user && item && user.uid) saveItem(user.uid, 'rooms', item);
      return updated;
    });
  }, [user]);

  const addRoom = useCallback((name: string) => {
    const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newRoom: Room = { id: uniqueId, name, squareMeters: 0, repairs: [], materials: [], labor: [] };
    setRooms(prev => [...prev, newRoom]);
    if (user && user.uid) saveItem(user.uid, 'rooms', newRoom);
  }, [user]);

  const removeRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    if (user && user.uid) deleteItem(user.uid, 'rooms', id);
  }, [user]);


  // 3. Compras
  const addPurchase = useCallback((purchase: Omit<PurchaseItem, 'id'>) => {
    const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newItem = { id: uniqueId, ...purchase };
    setPurchases(prev => [...prev, newItem]);
    if (user && user.uid) saveItem(user.uid, 'purchases', newItem);
  }, [user]);

  const removePurchase = useCallback((id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
    if (user && user.uid) deleteItem(user.uid, 'purchases', id);
  }, [user]);

  const addPaymentMethod = useCallback((method: string) => {
    if (!paymentMethods.includes(method)) {
      setPaymentMethods(prev => [...prev, method]);
      // Opcional: Salvar preferências do usuário
    }
  }, [paymentMethods]);


  // 4. Contas Recorrentes
  const addRecurringCost = useCallback((cost: Omit<RecurringCost, 'id'>) => {
    const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newItem = { id: uniqueId, ...cost };
    setRecurringCosts(prev => [...prev, newItem]);
    if (user && user.uid) saveItem(user.uid, 'recurringCosts', newItem);
  }, [user]);

  const removeRecurringCost = useCallback((id: string) => {
    setRecurringCosts(prev => prev.filter(rc => rc.id !== id));
    if (user && user.uid) deleteItem(user.uid, 'recurringCosts', id);
  }, [user]);

  const updateRecurringCost = useCallback((id: string, field: keyof Omit<RecurringCost, 'id'>, value: string | number) => {
    setRecurringCosts(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, [field]: value } : c);
      const item = updated.find(c => c.id === id);
      if (user && item && user.uid) saveItem(user.uid, 'recurringCosts', item);
      return updated;
    });
  }, [user]);


  // 5. Checklist
  const toggleChecklistItem = useCallback((itemId: string) => {
    setChecklist(prev => {
      const updatedList = prev.map(section => ({
        ...section,
        items: section.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
      }));

      // Encontra a seção que mudou para salvar apenas ela
      if (user && user.uid) {
        const changedSection = updatedList.find(section => section.items.some(i => i.id === itemId));
        if (changedSection) saveChecklistSection(user.uid, changedSection);
      }
      return updatedList;
    });
  }, [user]);

  // 6. Nome do Projeto
  const handleProjectNameChange = (name: string) => {
    setProjectName(name);
    if (user && user.uid) saveProjectName(user.uid, name);
  };


  // Auth Handlers
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  }

  const handleLogout = () => {
    setUser(null);
    // Limpar dados ao sair
    setInitialCosts([]);
    setRooms([]);
    setPurchases([]);
    setRecurringCosts([]);
    setChecklist(defaultChecklistData);
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
          setProjectName={handleProjectNameChange}
          onNavigate={setCurrentView}
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
          setProjectName={handleProjectNameChange}
        />;
    }
  };

  return (
    <div>
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onShare={() => setShareModalOpen(true)}
      />
      <main className="container">
        {renderView()}
      </main>
      {isShareModalOpen && <ShareModal onClose={() => setShareModalOpen(false)} projectName={projectName} />}
    </div>
  );
};

export default App;