// pages/OrderDetail.tsx - Order detail
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { showToast } from '../ui/components/Toast';
import { Badge } from '../ui/components/Badge';
import { CatLottie } from '../ui/components/CatLottie';
import { copyToClipboard } from '../utils/copy';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await ordersApi.status(id!);
      setOrder(res.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await ordersApi.resendOtp(id!);
      showToast('OTP dikirim ulang.', 'info');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal resend', 'error');
    }
  };

  const handleCancel = async () => {
    try {
      await ordersApi.cancel(id!);
      showToast('Order dibatalkan', 'info');
    } catch (err: any) {
      showToast('Gagal batalkan', 'error');
    }
  };

  if (loading) return <CatLottie variant="loading" />;

  return (
    <div className="order-detail">
      <div className="number-display">{order?.number}</div>
      <Badge status={order?.status}>{order?.status}</Badge>
      {order?.status === 'pending' && (
        <div>
          <CatLottie variant="loading" />
          <p>Nunggu OTP masuk...</p>
        </div>
      )}
      {order?.otp && (
        <div>
          <CatLottie variant="successCheck" />
          <p>OTP: {order.otp}</p>
          <button onClick={() => copyToClipboard(order.otp)}>Salin OTP</button>
        </div>
      )}
      {order?.status === 'expired' && (
        <div>
          <CatLottie variant="error" />
          <p>Waktunya habis, saldo kamu aman.</p>
        </div>
      )}
      <button onClick={handleResend}>Resend OTP</button>
      <button onClick={handleCancel}>Batalkan</button>
    </div>
  );
}