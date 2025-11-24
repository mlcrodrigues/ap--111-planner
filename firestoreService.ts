
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    getDoc
} from "firebase/firestore";

import { db } from "./firebase"; // Importa sua configuração corrigida
import { InitialCost, Room, PurchaseItem, RecurringCost, ChecklistSection } from "./types";

// --- FUNÇÕES AUXILIARES ---

// Salva (Cria ou Atualiza) um item em uma sub-coleção específica do usuário
export const saveItem = async (userId: string, collectionName: string, item: any) => {
    try {
        // Cria uma referência: users/{userId}/{collectionName}/{item.id}
        const itemRef = doc(db, "users", userId, collectionName, item.id);
        await setDoc(itemRef, item);
        console.log(`Item salvo em ${collectionName} `);
    } catch (error) {
        console.error(`Erro ao salvar em ${collectionName}: `, error);
    }
};

// Deleta um item
export const deleteItem = async (userId: string, collectionName: string, itemId: string) => {
    try {
        const itemRef = doc(db, "users", userId, collectionName, itemId);
        await deleteDoc(itemRef);
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
};

// Salva o Nome do Projeto (fica na raiz do documento do usuário)
export const saveProjectName = async (userId: string, name: string) => {
    try {
        const userRef = doc(db, "users", userId);
        // merge: true garante que não vamos apagar outros campos se eles existirem
        await setDoc(userRef, { projectName: name }, { merge: true });
    } catch (error) {
        console.error("Erro ao salvar nome do projeto:", error);
    }
};

// --- FUNÇÃO DE CARREGAMENTO (LOAD) ---
// Carrega todos os dados do usuário de uma vez ao fazer login
export const loadUserData = async (userId: string) => {
    const data = {
        initialCosts: [] as InitialCost[],
        rooms: [] as Room[],
        purchases: [] as PurchaseItem[],
        recurringCosts: [] as RecurringCost[],
        checklist: [] as ChecklistSection[],
        projectName: 'Meu Novo Apê' // Default
    };

    try {
        // 1. Carregar Custos Iniciais
        const costsSnap = await getDocs(collection(db, "users", userId, "initialCosts"));
        costsSnap.forEach(doc => data.initialCosts.push(doc.data() as InitialCost));

        // 2. Carregar Cômodos
        const roomsSnap = await getDocs(collection(db, "users", userId, "rooms"));
        roomsSnap.forEach(doc => data.rooms.push(doc.data() as Room));

        // 3. Carregar Compras
        const purchasesSnap = await getDocs(collection(db, "users", userId, "purchases"));
        purchasesSnap.forEach(doc => data.purchases.push(doc.data() as PurchaseItem));

        // 4. Carregar Contas Recorrentes
        const billsSnap = await getDocs(collection(db, "users", userId, "recurringCosts"));
        billsSnap.forEach(doc => data.recurringCosts.push(doc.data() as RecurringCost));

        // 5. Carregar Checklist
        const checklistSnap = await getDocs(collection(db, "users", userId, "checklist"));
        if (!checklistSnap.empty) {
            checklistSnap.forEach(doc => data.checklist.push(doc.data() as ChecklistSection));
            // Ordenar checklist se necessário (opcional, por ID ou campo de ordem)
        }

        // 6. Carregar Dados do Perfil (Nome do Projeto)
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.projectName) {
                data.projectName = userData.projectName;
            }
        }

        return data;

    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        return null;
    }
};

// Função especial para salvar o checklist inteiro (já que ele é um array complexo)
// Ou salvar seção por seção
export const saveChecklistSection = async (userId: string, section: ChecklistSection) => {
    await saveItem(userId, "checklist", section);
};