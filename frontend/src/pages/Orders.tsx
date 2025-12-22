// pages/Orders.tsx - Orders history
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { Badge } from '../ui/components/Badge';
import { CatLottie } from '../ui/components/CatLottie';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await ordersApi.history();
      setOrders(res.orders);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders">
      <h2>Riwayat Order</h2>
      {orders.length === 0 ? (
        <div className="empty">
          <CatLottie variant="hint" size="md" />
          <p>Belum ada riwayat. Coba beli dulu.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-item" onClick={() => navigate(`/orders/${order.id}`)}>
            <span>{order.number}</span>
            <Badge status={order.status}>{order.status}</Badge>
          </div>
        ))
      )}
    </div>
  );
}