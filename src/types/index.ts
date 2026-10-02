export interface SaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  clientName: string;
  clientContact: string;
  clientBizNumber?: string;
  address?: string;
  itemName: string;
  itemSpec: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplyPrice: number;
  taxType: 'tax_free' | 'taxable';
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial' | 'bill';
  paymentMethod: 'bank_transfer' | 'cash' | 'card' | 'promissory_note';
  deliveryMethod: 'jeju_direct' | 'freight_truck' | 'port_logistics' | 'pickup';
  memo?: string;
  createdAt: string;
}

export interface CashflowRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
  category: string;
  amount: number;
  clientOrVendor: string;
  paymentMethod: string;
  memo?: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  code: string;
  name: string;
  spec: string;
  category: 'natural_salt' | 'flake_salt' | 'roasted_salt' | 'industrial_salt' | 'kimchi_salt';
  categoryLabel: string;
  costPrice: number;
  standardPrice: number;
  bulkPrice: number; // 100포 이상
  stockQuantity: number;
  unit: string;
  isTaxFree: boolean;
  description: string;
}

export interface GoogleSheetConfig {
  webAppUrl: string;
  lastSyncedAt: string | null;
  isConnected: boolean;
  autoSync: boolean;
  autoSyncInterval: number; // in seconds, default 15
  sheetTitle?: string;
  syncStatus?: 'idle' | 'syncing' | 'connected' | 'error';
  errorMessage?: string | null;
}

export interface CompanyInfo {
  name: string;
  bizNumber: string;
  ceo: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  bankAccount: string;
  businessType: string;
  businessItem: string;
}

export type AppViewMode = 'all' | 'sales_public' | 'accounting_internal';
