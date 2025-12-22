// pages/DepositDetail.tsx - Deposit detail with QR
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { depositApi } from '../api/deposit';
import { showToast } from '../ui/components/Toast';
import { Badge } from '../ui/components/Badge';

export function DepositDetail() {
  const { id } = useParams<{ id: string }>();
  const [deposit, setDeposit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStatus();
  }, [id]);

  const loadStatus = async () => {
    try {
      const res = await depositApi.status(id!);
      setDeposit(res.deposit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await depositApi.cancel(id!);
      showToast('Deposit dibatalkan', 'info');
      navigate('/home');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal batalkan', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="deposit-detail">
      <Badge status={deposit?.status}>{deposit?.status}</Badge>
      {deposit?.status === 'pending' && (
        <div className="qr-section">
          <canvas id="qrcode" />
          <p>Scan QR untuk bayar. Status akan update otomatis.</p>
          <button onClick={loadStatus}>Saya sudah bayar</button>
          <button onClick={handleCancel}>Batalkan</button>
        </div>
      )}
      {deposit?.status === 'success' && (
        <div>
          <p>Saldo udah masuk.</p>
          <button onClick={() => navigate('/home')}>Balik ke Home</button>
        </div>
      )}
    </div>
  );
}