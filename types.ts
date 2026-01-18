
export type TransactionType = 'income' | 'expense' | 'memo' | 'credit_card';

export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Housing' 
  | 'Utilities' 
  | 'Health' 
  | 'Deposit' 
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO string
  note: string;
  periodStart?: string;
  periodEnd?: string;
}

// 這是解決錯誤的關鍵：確保 Settlement 被正確導出
export interface Settlement {
  id: string;
  settledDate: string;
  totalIncome: number;
  totalExpense: number;
  remaining: number;
  transactions: Transaction[];
}

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export interface AccountState {
  transactions: Transaction[];
  balance: number;
}
