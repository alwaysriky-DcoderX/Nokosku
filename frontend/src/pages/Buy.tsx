// pages/Buy.tsx - Buy flow
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { showToast } from '../ui/components/Toast';

export function Buy() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) loadServices();
  }, [step]);

  const loadServices = async () => {
    try {
      const res = await ordersApi.getServices();
      setServices(res.services);
    } catch (err) {
      console.error(err);
    }
  };

  const selectService = async (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
    try {
      const res = await ordersApi.getCountries(serviceId);
      setCountries(res.countries);
    } catch (err) {
      console.error(err);
    }
  };

  const selectCountry = async (countryCode: string) => {
    setSelectedCountry(countryCode);
    setStep(3);
    try {
      const res = await ordersApi.getOperators(countryCode);
      setOperators(res.operators);
    } catch (err) {
      console.error(err);
    }
  };

  const createOrder = async () => {
    try {
      const res = await ordersApi.create({
        service_code: selectedService,
        country_name: selectedCountry,
      });
      if (res.success) {
        showToast('Nomor udah keluar, nunggu OTP ya.', 'info');
        navigate(`/orders/${res.order?.id}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Order gagal', 'error');
    }
  };

  return (
    <div className="buy">
      {step === 1 && (
        <div>
          <h2>Pilih Aplikasi</h2>
          {services.map((s) => (
            <button key={s.id} onClick={() => selectService(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Pilih Negara</h2>
          {countries.map((c) => (
            <button key={c.code} onClick={() => selectCountry(c.code)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Pilih Operator</h2>
          {operators.map((o) => (
            <button key={o.id} onClick={() => createOrder()}>
              {o.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}