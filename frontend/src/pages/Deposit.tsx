// pages/Deposit.tsx - Topup page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositApi } from '../api/deposit';
import { showToast } from '../ui/components/Toast';

export function Deposit() {
  const [nominal, setNominal] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const quickAmounts = [10000, 20000, 50000, 100000, 300000, 500000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await depositApi.create({
        nominal: parseInt(nominal),
        metode: 'atlantic', // default
      });
      if (res.success) {
        showToast('QR siap, scan ya.', 'info');
        navigate(`/deposit/${res.deposit?.id}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Deposit gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit">
      <h2>Topup Saldo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Nominal"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          min="5000"
          required
        />
        <div className="quick-amounts">
          {quickAmounts.map((amount) => (
            <button
              type="button"
              key={amount}
              onClick={() => setNominal(amount.toString())}
            >
              {amount / 1000}k
            </button>
          ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Lanjutkan'}
        </button>
      </form>
    </div>
  );
}