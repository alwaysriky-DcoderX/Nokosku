import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCountries, getOperators, getServices } from '../api/services';
import { getBalance } from '../api/user';
import type { ServiceItem, CountryItem, OperatorItem } from '../api/services';
import { createOrder, quoteOrder } from '../api/orders';
import type { PriceQuote } from '../api/orders';
import { Page } from '../ui/layouts/Page';
import { Input } from '../ui/components/Input';
import { useToast } from '../ui/hooks/useToast';
import { CatLottie } from '../ui/components/CatLottie';
import { formatMoney } from '../utils/formatMoney';

export function Buy() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedService, setService] = useState<ServiceItem | null>(null);
  const [selectedCountry, setCountry] = useState<CountryItem | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<OperatorItem | null>(null);
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [expandedCountry, setExpandedCountry] = useState<CountryItem | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: getServices
  });

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ['countries', selectedService?.service_code],
    queryFn: () => getCountries(selectedService!.service_code),
    enabled: !!selectedService
  });

  const { data: operators, isLoading: loadingOperators } = useQuery({
    queryKey: ['operators', selectedCountry?.name],
    queryFn: () => getOperators(selectedCountry!.name),
    enabled: !!selectedCountry
  });

  const { data: balance } = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance
  });

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter(s => s.service_name.toLowerCase().includes(search.toLowerCase()));
  }, [services, search]);

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countries, countrySearch]);

  const goQuote = async (operator: OperatorItem) => {
    if (!selectedService || !selectedCountry || !operator) return;
    setLoading(true);
    try {
      const q = await quoteOrder({
        service_code: selectedService.service_code,
        country_name: selectedCountry.name,
        operator_id: Number(operator.id)
      });
      setQuote(q);
      setStep(3);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err?.response?.data?.error || 'Gagal hitung harga.';
      toast.push({ type: 'error', title: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedService || !selectedCountry || !selectedOperator) return;
    if (balance !== undefined && quote && balance < Number(quote.price)) {
      toast.push({ type: 'error', title: 'Saldo tidak cukup' });
      return;
    }
    setLoading(true);
    try {
      await createOrder({
        service_code: selectedService.service_code,
        country_name: selectedCountry.name,
        operator_id: Number(selectedOperator.id)
      });
      toast.push({ type: 'hint', title: 'Nomor udah keluar, nunggu OTP ya.' });
      navigate('/riwayat');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err?.response?.data?.error || 'Maaf, gagal bikin order.';
      toast.push({ type: 'error', title: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Beli nomor OTP" showBack>
      {step === 1 && (
        <>
          <Input
            label="Cari aplikasi"
            icon="bi-search"
            placeholder="Cari aplikasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {loadingServices && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="shimmer" style={{ height: 120, borderRadius: 12 }}></div>
              ))}
            </div>
          )}
          {!loadingServices && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {filteredServices.map(service => (
                <div
                  key={service.service_code}
                  className="card-plain"
                  onClick={() => {
                    setService(service);
                    setStep(2);
                  }}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: 16
                  }}
                >
                   <img
                     src={service.service_img}
                     alt={service.service_name}
                     style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 8 }}
                     loading="lazy"
                     onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                   />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{service.service_name}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {step === 2 && selectedService && (
        <div style={{ animation: 'slideUp 0.5s ease-out', padding: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
             <img
               src={selectedService.service_img}
               alt={selectedService.service_name}
               style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 12 }}
               loading="lazy"
               onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
             />
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>{selectedService.service_name}</div>
          </div>
          <div className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>Pilih negara untuk {selectedService.service_name}</div>
          <div style={{ marginBottom: 16 }}>
            <Input
              label=""
              placeholder="Cari negara..."
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
            />
          </div>
          {loadingCountries && <div style={{ textAlign: 'center' }}><CatLottie variant="loading" size="lg" /></div>}
          {!loadingCountries && filteredCountries && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {filteredCountries.map(country => (
                <div>
                  <div
                    className="card-plain"
                    onClick={() => {
                      setCountry(country);
                      setSelectedOperator(null);
                      setExpandedCountry(expandedCountry?.number_id === country.number_id ? null : country);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: 12,
                      border: selectedCountry?.number_id === country.number_id ? '2px solid var(--primary)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                       <img
                         src={country.img}
                         alt={country.name}
                         style={{ width: 24, height: 18, borderRadius: 2 }}
                         loading="lazy"
                         onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                       />
                       <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{country.name} (+{country.prefix})</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="muted" style={{ fontSize: '0.8rem' }}>
                        Stock: {country.stock_total}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {formatMoney(country.pricelist.length > 0 ? Math.min(...country.pricelist.map(p => p.price + 1000)) : 0)}
                        </div>
                        <i
                          className="bi bi-chevron-down"
                          style={{
                            transform: expandedCountry?.number_id === country.number_id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {expandedCountry?.number_id === country.number_id && (
                    <div style={{ marginTop: 8, animation: 'slideUp 0.3s ease-out' }}>
                      <div className="muted" style={{ marginBottom: 8 }}>Pilih operator:</div>
                      {loadingOperators && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="shimmer" style={{ height: 40, borderRadius: 8 }}></div>
                          ))}
                        </div>
                      )}
                      {!loadingOperators && operators && (
                        <div className="card-plain" style={{ padding: 12 }}>
                          {operators.map(op => (
                            <div
                              key={op.id}
                              className={`list-row ${selectedOperator?.id === op.id ? 'selected' : ''}`}
                              onClick={() => setSelectedOperator(op)}
                              style={{ cursor: 'pointer', padding: '8px 0' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                 <img
                                   src={op.name === 'any' ? '/vite.svg' : op.image}
                                   alt={op.name === 'any' ? 'Acak' : op.name}
                                   style={{ width: 20, height: 20, borderRadius: 4 }}
                                   loading="lazy"
                                   onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                                 />
                                <div style={{ fontWeight: 700 }}>{op.name === 'any' ? 'Acak' : op.name}</div>
                              </div>
                              <i className="bi bi-check" style={{ opacity: selectedOperator?.id === op.id ? 1 : 0 }} />
                            </div>
                          ))}
                          <button
                            className="primary-btn"
                            onClick={() => selectedOperator && goQuote(selectedOperator)}
                            disabled={!selectedOperator}
                            style={{ marginTop: 12, width: '100%' }}
                          >
                            Lanjut ke Konfirmasi
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {expandedCountry && (
            <div style={{ marginTop: 16, animation: 'slideUp 0.3s ease-out' }}>
              <div className="muted">Pilih operator untuk {expandedCountry.name}</div>
              {loadingOperators && <CatLottie variant="loading" size="md" />}
              {!loadingOperators && operators && (
                <div className="card-plain">
                  {operators.map(op => (
                    <div
                      key={op.id}
                      className={`list-row ${selectedOperator?.id === op.id ? 'selected' : ''}`}
                      onClick={() => setSelectedOperator(op)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ fontWeight: 700 }}>{op.name}</div>
                      <i className="bi bi-check" style={{ opacity: selectedOperator?.id === op.id ? 1 : 0 }} />
                    </div>
                  ))}
                  <button
                    className="primary-btn"
                    onClick={() => selectedOperator && goQuote(selectedOperator)}
                    disabled={!selectedOperator}
                    style={{ marginTop: 12 }}
                  >
                    Lanjut ke Konfirmasi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 3 && selectedCountry && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="muted">Konfirmasi pesanan untuk {selectedCountry.name}</div>
          {loading && <CatLottie variant="loading" size="md" />}
          {!loading && quote && (
            <>
              <div style={{ textAlign: 'center', padding: 20, background: 'var(--surface)', borderRadius: 12 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                   {selectedService.service_name} - {selectedCountry.name} (+{selectedCountry.prefix}) - {selectedOperator?.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  Nomor: {quote.phone_number} · Status: {quote.status}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0' }}>
                  {formatMoney(Number(quote.price))}
                </div>
               </div>
               {balance !== undefined && quote && balance < Number(quote.price) && (
                 <div style={{ textAlign: 'center', padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--error)' }}>
                   <CatLottie variant="error" size="md" />
                   <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Saldo tidak cukup</div>
                   <div className="muted" style={{ marginBottom: 12 }}>Kamu butuh {formatMoney(Number(quote.price) - balance)} lagi untuk membeli ini.</div>
                   <Link to="/deposit" className="primary-btn" style={{ display: 'inline-block' }}>Deposit Sekarang</Link>
                 </div>
               )}
               <div className="two-col">
                 <button className="ghost-btn" onClick={() => {
                   setStep(2);
                   setExpandedCountry(null);
                   setSelectedOperator(null);
                 }}>
                   Kembali
                 </button>
                 <button
                   className="primary-btn"
                   onClick={handleCreate}
                   disabled={balance !== undefined && quote && balance < Number(quote.price)}
                 >
                   Beli Sekarang
                 </button>
               </div>
            </>
          )}
        </div>
      )}
    </Page>
  );
}