// api/orders.ts - Order endpoints
import http from './http';

export interface Service {
  id: string;
  name: string;
}

export interface Services {
  success: boolean;
  services: Service[];
}

export interface Country {
  code: string;
  name: string;
}

export interface Countries {
  success: boolean;
  countries: Country[];
}

export interface Operator {
  id: string;
  name: string;
}

export interface Operators {
  success: boolean;
  operators: Operator[];
}

export interface CreateOrderData {
  service_code: string;
  country_name: string;
}

export interface Order {
  success: boolean;
  order?: {
    id: string;
    number: string;
    service: string;
    country: string;
    status: string;
    price: number;
    created_at: string;
    otp?: string;
  };
  message?: string;
}

export interface OrdersHistory {
  success: boolean;
  orders: Order['order'][];
}

export const ordersApi = {
  getServices: (): Promise<Services> =>
    http.get('/api/v1/orders/services').then(res => res.data),

  getCountries: (serviceId: string): Promise<Countries> =>
    http.get(`/api/v1/orders/countries/${serviceId}`).then(res => res.data),

  getOperators: (countryCode: string): Promise<Operators> =>
    http.get(`/api/v1/orders/operators/${countryCode}`).then(res => res.data),

  create: (data: CreateOrderData): Promise<Order> =>
    http.post('/api/v1/orders/create', data).then(res => res.data),

  status: (id: string): Promise<Order> =>
    http.get(`/api/v1/orders/${id}`).then(res => res.data),

  resendOtp: (id: string): Promise<{ success: boolean; message: string }> =>
    http.post(`/api/v1/orders/${id}/resend`).then(res => res.data),

  cancel: (id: string): Promise<{ success: boolean; message: string }> =>
    http.post(`/api/v1/orders/${id}/cancel`).then(res => res.data),

  history: (): Promise<OrdersHistory> =>
    http.get('/api/v1/orders/history').then(res => res.data),
};