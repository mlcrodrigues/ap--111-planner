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
        return (
            <input 
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-3xl font-bold text-slate-800 bg-slate-100 rounded-lg px-2 py-1 outline-none w-full md:w-auto"
            />
        )
    }

    return (
        <h2 onClick={() => setIsEditing(true)} className="text-3xl font-bold text-slate-800 cursor-pointer p-1 rounded-lg hover:bg-slate-100" title="Clique para editar">
            {name}
        </h2>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ sections, initialCosts, rooms, purchases, projectName, setProjectName }) => {
    const progressData = useMemo(() => {
        if (!sections || sections.length === 0) {
            return { progress: 0, label: 'Nenhuma tarefa' };
        }
        
        const allItems = sections.flatMap(s => s.items);
        const totalItems = allItems.length;
        const completedItems = allItems.filter(item => item.completed).length;
        const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
        
        const currentSection = sections.find(s => s.items.some(i => !i.completed)) || sections[sections.length - 1];
        
        return { progress, label: `Próximo Passo: ${currentSection.title}` };
    }, [sections]);
    
    // Cálculos Financeiros
    const totalInitialCosts = useMemo(() => initialCosts.reduce((acc, cost) => acc + cost.value, 0), [initialCosts]);
    const totalRoomsCost = useMemo(() => rooms.reduce((total, room) => {
        const materialsTotal = room.materials.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const laborTotal = room.labor.reduce((acc, item) => acc + item.price, 0);
        return total + materialsTotal + laborTotal;
    }, 0), [rooms]);
    const totalPurchases = useMemo(() => purchases.reduce((acc, purchase) => acc + purchase.price, 0), [purchases]);
    const grandTotal = useMemo(() => totalInitialCosts + totalRoomsCost + totalPurchases, [totalInitialCosts, totalRoomsCost, totalPurchases]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const { progress, label } = progressData;

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="animate-fade-in space-y-8">
            <ProjectTitle name={projectName} setName={setProjectName} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Progresso da Jornada</h3>
                    <div className="relative flex justify-center items-center">
                        <svg width="150" height="150" viewBox="0 0 150 150">
                            <circle cx="75" cy="75" r={radius} stroke="#f3f4f6" strokeWidth="14" fill="transparent" />
                            <circle
                                cx="75"
                                cy="75"
                                r={radius}
                                stroke="#EF7669"
                                strokeWidth="14"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 75 75)"
                                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-[#202945]">
                                {`${Math.round(progress)}%`}
                            </span>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-500 font-semibold">{label}</p>
                    <p className="text-sm text-slate-400 mt-1">Visite a aba "Jornada" para ver todos os passos.</p>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Resumo Financeiro</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <span className="font-semibold text-slate-600">Custos Iniciais</span>
                            <span className="font-bold text-lg text-slate-800">{formatCurrency(totalInitialCosts)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <span className="font-semibold text-slate-600">Reformas (Cômodos)</span>
                            <span className="font-bold text-lg text-slate-800">{formatCurrency(totalRoomsCost)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <span className="font-semibold text-slate-600">Compras</span>
                            <span className="font-bold text-lg text-slate-800">{formatCurrency(totalPurchases)}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-600">Total Geral</span>
                            <span className="text-2xl font-bold text-[#EF7669]">{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;