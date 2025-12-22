// api/user.ts - User endpoints
import http from './http';

export interface Profile {
  success: boolean;
  profile: {
    email: string;
    name: string;
    balance: number;
  };
}

export interface Balance {
  success: boolean;
  balance: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: number;
  created_at: string;
}

export interface Transactions {
  success: boolean;
  transactions: Transaction[];
}

export const userApi = {
  getProfile: (): Promise<Profile> =>
    http.get('/api/v1/user/profile').then(res => res.data),

  updateProfile: (data: Partial<{ name: string; email: string }>): Promise<{ success: boolean }> =>
    http.put('/api/v1/user/profile', data).then(res => res.data),

  getBalance: (): Promise<Balance> =>
    http.get('/api/v1/user/profile/balance').then(res => res.data),

  getTransactions: (): Promise<Transactions> =>
    http.get('/api/v1/user/profile/transactions').then(res => res.data),
};