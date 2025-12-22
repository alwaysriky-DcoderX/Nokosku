import { http } from './http';

export type ServiceItem = {
  service_code: number;
  service_name: string;
  service_img: string;
};

export type CountryItem = {
  number_id: number;
  name: string;
  img: string;
  prefix: string;
  iso_code: string;
  stock_total: number;
  pricelist: { provider_id: string | number; price: number; price_format: string; available: boolean }[];
};

export type OperatorItem = {
  id: number | string;
  name: string;
  image?: string;
};

export async function getServices() {
  const { data } = await http.get<{ success: boolean; services: ServiceItem[] }>('/api/v1/orders/services');
  return data.services.map(s => ({
    service_code: s.service_code,
    service_name: s.service_name,
    service_img: s.service_img
  }));
}

export async function getCountries(serviceId: string | number) {
  const { data } = await http.get<{ success: boolean; countries: CountryItem[] }>(
    `/api/v1/orders/countries/${serviceId}`
  );
  return data.countries;
}

export async function getOperators(countryCode: string) {
  const { data } = await http.get<{ success: boolean; operators: OperatorItem[] }>(
    `/api/v1/orders/operators/${encodeURIComponent(countryCode)}`
  );
  return data.operators;
}
