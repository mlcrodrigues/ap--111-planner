import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChecklistSection, InitialCost, Room, PurchaseItem } from '../types';

interface DashboardProps {
    sections: ChecklistSection[];
    initialCosts: InitialCost[];
    rooms: Room[];
    purchases: PurchaseItem[];
    projectName: string;
    setProjectName: (name: string) => void;
}

// --- Componente de Edição do Título ---
const ProjectTitle: React.FC<{ name: string; setName: (name: string) => void }> = ({ name, setName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (tempName.trim()) {
            setName(tempName.trim());
        } else {
            setTempName(name);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setTempName(name);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        // Classes customizadas para input de edição
        return (
            <input
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="project-title-input"
            />
        )
    }

    // Classes customizadas para exibição
    return (
        <h2 onClick={() => setIsEditing(true)} className="project-title-display" title="Clique para editar">
            {name}
        </h2>
    );
}

// --- Componente de Progresso Circular (SVG) ---
const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width="120" height="120" viewBox="0 0 120 120" className="progress-ring">
            {/* Fundo do círculo */}
            <circle
                stroke="var(--color-border)"
                fill="transparent"
                strokeWidth="12"
                r={radius}
                cx="60"
                cy="60"
            />
            {/* Anel de progresso (Coral) */}
            <circle
                stroke="var(--color-accent)"
                fill="transparent"
                strokeWidth="12"
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s' }}
                r={radius}
                cx="60"
                cy="60"
                transform="rotate(-90 60 60)"
            />
            {/* Texto de porcentagem */}
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--color-primary)" fontSize="20" fontWeight="bold">
                {Math.round(progress)}%
            </text>
        </svg>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ sections, initialCosts, rooms, purchases, projectName, setProjectName, onNavigate }) => {

    // --- Lógica de Cálculo de Dados ---

    const progressData = useMemo(() => {
        const allItems = sections.flatMap(s => s.items);
        const totalItems = allItems.length;
        const completedItems = allItems.filter(item => item.completed).length;
        const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        const nextSection = sections.find(s => s.items.some(i => !i.completed)) || sections[sections.length - 1];

        return { progress, label: `Próximo: ${nextSection.title}` };
    }, [sections]);

    const totalInitialCosts = useMemo(() => initialCosts.reduce((acc, cost) => acc + cost.value, 0), [initialCosts]);
    const totalPurchases = useMemo(() => purchases.reduce((acc, purchase) => acc + purchase.price, 0), [purchases]);

    // Calcula custo de reparos/materiais/mão de obra para Cômodos
    const totalRoomsCost = useMemo(() => rooms.reduce((total, room) => {
        const materialsTotal = room.materials.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const laborTotal = room.labor.reduce((acc, item) => acc + item.price, 0);
        return total + materialsTotal + laborTotal;
    }, 0), [rooms]);

    // O Grande Total é a soma de todos os custos (Inicial + Cômodos + Compras)
    const grandTotal = useMemo(() => totalInitialCosts + totalRoomsCost + totalPurchases, [totalInitialCosts, totalRoomsCost, totalPurchases]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const lastPurchase = purchases.length > 0 ? purchases[purchases.length - 1] : null;

    const { progress, label } = progressData;

    return (
        <div className="dashboard-grid">

            {/* --------------------------- CARD PRINCIPAL: TÍTULO, EDIÇÃO E PROGRESSO --------------------------- */}
            <div className="card large-card title-card">

                <ProjectTitle name={projectName} setName={setProjectName} />

                <h3 className="text-lg mt-4 mb-4">Progresso da Jornada</h3>

                <div className="flex items-center gap-4">
                    <ProgressRing progress={progress} />
                    <div className="flex-col ml-6">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm opacity-80 mt-1">{Math.round(progress)}% das etapas concluídas!</p>
                    </div>
                </div>
            </div>

            {/* --------------------------- CARD 2: RESUMO GERAL DE CUSTOS --------------------------- */}
            <div className="card">
                <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Orçamento Total</h2>

                <div className="data-display">
                    <p className="data-label">Total Gasto/Previsto:</p>
                    <p className="data-value" style={{ color: 'var(--color-accent)' }}>{formatCurrency(grandTotal)}</p>
                </div>

                <div className="data-display sub-data">
                    <p className="data-label">Custos Iniciais:</p>
                    <p className="data-value-small">{formatCurrency(totalInitialCosts)}</p>
                </div>

                <div className="data-display sub-data">
                    <p className="data-label">Compras/Decoração:</p>
                    <p className="data-value-small">{formatCurrency(totalPurchases + totalRoomsCost)}</p>
                </div>

            </div>

            {/* --------------------------- CARD 3: ÚLTIMA ATIVIDADE --------------------------- */}
            <div className="card">
                <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Última Compra</h2>

                {lastPurchase ? (
                    <div className="last-purchase-data">
                        <p className="font-semibold">{lastPurchase.itemName}</p>
                        <p className="text-xl" style={{ color: 'var(--color-accent)' }}>{formatCurrency(lastPurchase.price)}</p>
                        <p className="text-xs text-gray-500 mt-1">em {lastPurchase.store} ({lastPurchase.purchaseDate})</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Nenhuma compra registrada ainda.</p>
                )}
            </div>

            {/* --------------------------- CARD 4: RESUMO DE CÔMODOS --------------------------- */}
            <div className="card">
                <h2 className="section-title" style={{ color: 'var(--color-primary)' }}>Meu Apê</h2>

                <div className="data-display">
                    <p className="data-label">Cômodos Cadastrados:</p>
                    <p className="data-value">{rooms.length}</p>
                </div>

                <div className="data-display sub-data">
                    <p className="data-label">Custos de Reparos/Mão de Obra:</p>
                    <p className="data-value-small">{formatCurrency(totalRoomsCost)}</p>
                </div>


                <button
                    className="btn-primary"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => onNavigate('rooms')}
                >
                    Gerenciar Cômodos
                </button>
            </div>
        </div>
    );
};

export default Dashboard;