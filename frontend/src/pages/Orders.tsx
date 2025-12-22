import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../api/orders';
import { getDepositHistory } from '../api/deposit';
import { Page } from '../ui/layouts/Page';
import { formatDateTime } from '../utils/formatTime';
import { CatLottie } from '../ui/components/CatLottie';

type HistoryItem = {
  id: number;
  type: 'order' | 'deposit' | 'activity';
  title: string;
  subtitle: string;
  status?: string;
  created_at: string;
  path?: string;
};

export function Riwayat() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: orders } = useQuery({
    queryKey: ['order-history'],
    queryFn: getOrderHistory
  });

  const { data: deposits } = useQuery({
    queryKey: ['deposit-history'],
    queryFn: getDepositHistory
  });

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await fetch('/api/v1/user/profile/activities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });



  const allItems: HistoryItem[] = useMemo(() => {
    const items: HistoryItem[] = [];

    if (orders) {
      orders.forEach(o => items.push({
        id: o.id,
        type: 'order',
        title: o.service,
        subtitle: `${o.number} · ${formatDateTime(o.created_at)}`,
        status: o.status,
        created_at: o.created_at,
        path: `/orders/${o.id}`
      }));
    }

    if (deposits) {
      deposits.forEach(d => items.push({
        id: d.id,
        type: 'deposit',
        title: 'Deposit',
        subtitle: `Rp${d.nominal} · ${formatDateTime(d.created_at)}`,
        status: d.status,
        created_at: d.created_at,
        path: `/deposit/${d.id}`
      }));
    }

    if (activities?.activities) {
      activities.activities.forEach((a: any) => items.push({
        id: a.id,
        type: 'activity',
        title: (a.event || 'Activity') as string,
        subtitle: (a.detail || 'No detail') as string,
        created_at: a.created_at
      }));
    }

    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, deposits, activities]);

  const filtered = useMemo(() => {
    let filtered = allItems;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    if (statusFilter !== 'all' && typeFilter !== 'activity') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allItems, typeFilter, statusFilter, searchQuery]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {};
    filtered.forEach(item => {
      const date = new Date(item.created_at).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [filtered]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return 'bi-bag-check';
      case 'deposit': return 'bi-wallet2';
      case 'activity': return 'bi-activity';
      default: return 'bi-clock-history';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'cancel': case 'expired': return 'muted';
      case 'processing': case 'otp_received': return 'primary';
      default: return '';
    }
  };

  return (
    <Page title="Riwayat" showBack>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Cari riwayat..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            Semua
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${typeFilter === 'order' ? 'active' : ''}`}
            onClick={() => setTypeFilter('order')}
          >
            Orders
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${typeFilter === 'deposit' ? 'active' : ''}`}
            onClick={() => setTypeFilter('deposit')}
          >
            Deposits
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${typeFilter === 'activity' ? 'active' : ''}`}
            onClick={() => setTypeFilter('activity')}
          >
            Activities
          </button>
        </li>
      </ul>

      {(typeFilter === 'all' || typeFilter === 'order' || typeFilter === 'deposit') && (
        <div style={{ marginTop: 12, marginBottom: 12, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 4 }}>
          <div style={{ display: 'inline-flex', gap: 8 }}>
            {['all', 'pending', 'processing', 'otp_received', 'success', 'expired', 'cancel'].map(s => (
              <button
                key={s}
                className={`chip ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'Semua Status' : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <CatLottie variant="notFound" size="lg" loop />
          <div className="muted" style={{ fontSize: '1.1rem', marginTop: 10 }}>Belum ada riwayat yang cocok.</div>
          <button className="ghost-btn" style={{ marginTop: 10 }} onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      )}

      <div className="card-plain">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <div style={{ padding: '8px 0', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
              {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {items.map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                className="list-row"
                onClick={item.path ? () => navigate(item.path as string) : undefined}
                style={{
                  cursor: item.path ? 'pointer' : 'default',
                  padding: '12px 0',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className={`bi ${getIcon(item.type)}`} style={{ color: 'var(--muted)', fontSize: '1.2rem' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 2 }}>
                      {item.title || 'Unknown'}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                      {item.subtitle || 'No detail'}
                    </div>
                  </div>
                </div>
                {item.status && (
                  <span className={`badge ${getStatusClass(item.status)}`} style={{ fontSize: '0.75rem' }}>
                    {item.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}
