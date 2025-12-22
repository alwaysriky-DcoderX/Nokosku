// api/deposit.ts - Deposit endpoints
import http from './http';

export interface CreateDepositData {
  nominal: number;
  metode: string;
}

export interface Deposit {
  success: boolean;
  deposit?: {
    id: string;
    nominal: number;
    status: string;
    qr_string?: string;
    qr_image?: string;
    created_at: string;
    expired_at: string;
  };
  message?: string;
}

export interface DepositHistory {
  success: boolean;
  deposits: Deposit[];
}

export const depositApi = {
  create: (data: CreateDepositData): Promise<Deposit> =>
    http.post('/api/v1/deposit/create', data).then(res => res.data),

  status: (id: string): Promise<Deposit> =>
    http.get(`/api/v1/deposit/${id}`).then(res => res.data),

  cancel: (id: string): Promise<{ success: boolean; message: string }> =>
    http.post(`/api/v1/deposit/${id}/cancel`).then(res => res.data),

  history: (): Promise<DepositHistory> =>
    http.get('/api/v1/deposit/history').then(res => res.data),
};