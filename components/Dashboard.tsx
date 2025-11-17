import React from 'react';
import { InitialCost, Room, PurchaseItem, ChecklistSection } from '../types'; 

// 1. Definição das Props (Interfaces)
interface DashboardProps {
  sections: ChecklistSection[];
  initialCosts: InitialCost[];
  rooms: Room[];
  purchases: PurchaseItem[];
  projectName: string;
  setProjectName: (name: string) => void; 
}

// 2. Funções de Cálculo do Dashboard
const calculateTotalCost = (costs: InitialCost[]) => {
  return costs.reduce((sum, cost) => sum + cost.value, 0);
};

const calculateProgress = (sections: ChecklistSection[]) => {
  let totalItems = 0;
  let completedItems = 0;

  sections.forEach(section => {
    totalItems += section.items.length;
    completedItems += section.items.filter(item => item.completed).length;
  });

  if (totalItems === 0) return 0;
  return Math.round((completedItems / totalItems) * 100);
};


const Dashboard: React.FC<DashboardProps> = ({
  sections,
  initialCosts,
  rooms,
  purchases,
  projectName,
  setProjectName,
}) => {
  
  // Executa os cálculos
  const progressPercent = calculateProgress(sections);
  const totalCost = calculateTotalCost(initialCosts);
  
  // Formatação para BRL
  const formatBRL = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Encontra a última compra para exibição
  const lastPurchase = purchases.length > 0 ? purchases[purchases.length - 1] : null;

  return (
    <div className="dashboard-grid">
      
      {/* --------------------------- CARD 1: TÍTULO E PROGRESSO --------------------------- */}
      <div className="card large-card title-card" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <h1 className="text-xl font-bold mb-4">
          {projectName}
          {/* Implementação futura de edição de nome: */}
          {/* <button onClick={() => alert('Implementar edição!')}>✏️</button> */}
        </h1>
        
        <h2 className="text-sm font-semibold mb-2">Progresso da Jornada</h2>
        
        <div className="progress-display flex items-center justify-between">
          <div className="progress-ring-container" style={{ width: '80px', height: '80px' }}>
            {/* Implementar Gráfico de Progresso Circular (ex: usando SVG ou div + CSS) */}
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{progressPercent}%</div>
          </div>
          <p className="text-lg ml-4">{progressPercent}% das etapas concluídas!</p>
        </div>
      </div>
      
      {/* --------------------------- CARD 2: RESUMO FINANCEIRO --------------------------- */}
      <div className="card">
        <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Resumo Financeiro</h2>
        
        <div className="mt-2">
          <p className="font-semibold text-sm">Custo Inicial Total:</p>
          <p className="text-2xl" style={{ color: 'var(--color-accent)' }}>{formatBRL(totalCost)}</p>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <p className="font-semibold text-sm">Cômodos Cadastrados:</p>
          <p className="text-xl">{rooms.length}</p>
        </div>
      </div>
      
      {/* --------------------------- CARD 3: ÚLTIMA ATIVIDADE --------------------------- */}
      <div className="card">
        <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Última Compra</h2>
        
        {lastPurchase ? (
          <div className="mt-2">
            <p className="font-semibold">{lastPurchase.itemName}</p>
            <p className="text-lg" style={{ color: 'var(--color-accent)' }}>{formatBRL(lastPurchase.price)}</p>
            <p className="text-xs text-gray-500">em {lastPurchase.store}</p>
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma compra registrada ainda.</p>
        )}
      </div>

      {/* --------------------------- CARD 4: LINKS RÁPIDOS (Exemplo) --------------------------- */}
      <div className="card">
        <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Ações Rápidas</h2>
        <button className="btn-primary w-full mt-2">Ver Custos Iniciais</button>
        <button className="btn-primary w-full mt-2" style={{ backgroundColor: '#ccc', color: 'var(--color-text-dark)' }}>Adicionar Compra</button>
      </div>
    </div>
  );
};

export default Dashboard;