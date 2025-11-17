export interface InitialCost {
  id: string;
  name: string;
  value: number;
  dueDate: string;
}

export interface RepairItem {
  id: string;
  description: string;
  completed: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface LaborItem {
  id: string;
  providerName: string;
  phone: string;
  price: number;
}

export interface Room {
  id: string;
  name: string;
  squareMeters: number;
  repairs: RepairItem[];
  materials: MaterialItem[];
  labor: LaborItem[];
}

export interface PurchaseItem {
  id: string;
  store: string;
  itemName: string;
  price: number;
  paymentMethod: string;
  purchaseDate: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface RecurringCost {
  id: string;
  name: string;
  value: number;
  dueDay: number; 
}

export interface MovingCompany {
  id: string;
  name: string;
  price: number;
  availableDate: string;
  contact: string;
}

// Novo tipo para simulação de usuário
export interface User {
  name: string;
  email: string;
}
