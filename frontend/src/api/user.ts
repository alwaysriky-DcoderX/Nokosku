import { http } from './http';

export type Profile = {
  email: string;
  name?: string;
  balance: number;
  is_admin?: boolean;
  is_banned?: boolean;
};

export type Transaction = {
  id: number;
  amount: number;
  type: string;
  created_at: string;
};

export async function getProfile() {
  const { data } = await http.get<{ success: boolean; profile: Profile }>('/api/v1/user/profile');
  return data.profile;
}

export async function updateProfile(payload: Partial<Profile>) {
  const { data } = await http.put('/api/v1/user/profile', payload);
  return data;
}

export async function getBalance() {
  const { data } = await http.get<{ success: boolean; balance: number }>('/api/v1/user/balance');
  return data.balance;
}

export async function getTransactions() {
   const { data } = await http.get<{ success: boolean; transactions: Transaction[] }>('/api/v1/user/transactions');
  return data.transactions;
}
