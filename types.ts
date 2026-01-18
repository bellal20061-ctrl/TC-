
export interface ServiceItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: number;
}

export interface Memo {
  id: string;
  customerId: string;
  items: ServiceItem[];
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
  date: number;
  memoNumber: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: number;
  note: string;
}

export type ViewType = 'dashboard' | 'customers' | 'billing' | 'expenses' | 'memo-view';
