// pages/Home.tsx - Home dashboard
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user';
import { ordersApi } from '../api/orders';
import { formatMoney } from '../utils/formatMoney';
import { Badge } from '../ui/components/Badge';

export function Home() {
  const [balance, setBalance] = useState('0');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balRes, ordersRes] = await Promise.all([
        userApi.getBalance(),
        ordersApi.history(),
      ]);
      setBalance(balRes.balance);
      setRecentOrders(ordersRes.orders.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="home">
      <div className="home-header">
        <div className="user-info">
          <span>Hai, {user.name || user.email}</span>
        </div>
        <div className="balance-card">
          <p>Saldo kamu</p>
          <h2>{formatMoney(parseFloat(balance))}</h2>
          <button onClick={() => navigate('/deposit')}>Topup</button>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => navigate('/deposit')}>Topup</button>
        <button onClick={() => navigate('/buy')}>Beli OTP</button>
        <button onClick={() => navigate('/orders')}>Riwayat</button>
        <button onClick={() => navigate('/profile')}>Bantuan</button>
      </div>
      <div className="recent-orders">
        <h3>Terakhir</h3>
        {recentOrders.length === 0 ? (
          <p>Belum ada riwayat</p>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="order-item" onClick={() => navigate(`/orders/${order.id}`)}>
              <span>{order.number}</span>
              <Badge status={order.status}>{order.status}</Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}