import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/hooks/useAuth';
import { Page } from '../ui/layouts/Page';
import { formatMoney } from '../utils/formatMoney';
import { formatDateTime } from '../utils/formatTime';

export function Profile() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await fetch('/api/v1/user/profile/activities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    }
  });

  return (
    <Page title="Akun" showBack>
      <div className="card-plain" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 999,
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border)'
          }}
        >
          <i className="bi bi-person" />
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{profile?.email}</div>
          <div className="muted">{profile?.name}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontWeight: 700 }}>{formatMoney(profile?.balance || 0)}</div>
      </div>

      <div className="card-plain" style={{ marginTop: 12 }}>
        <div className="list-row" onClick={() => navigate('/deposit')}>
          <span>Riwayat deposit</span>
          <i className="bi bi-chevron-right" />
        </div>
        <div className="list-row" onClick={() => navigate('/orders')}>
          <span>Riwayat order</span>
          <i className="bi bi-chevron-right" />
        </div>
        <div className="list-row" onClick={() => navigate('/settings')}>
          <span>Pengaturan</span>
          <i className="bi bi-chevron-right" />
        </div>
        <div className="list-row" onClick={logout}>
          <span>Logout</span>
          <i className="bi bi-box-arrow-right" />
        </div>
      </div>

      <div className="card-plain" style={{ marginTop: 12 }}>
        <div className="section-title">Riwayat Aktivitas</div>
        {activities?.activities?.slice(0, 10).map((act: any) => {
          const getIcon = (event: string) => {
            if (event.includes('login')) return 'bi-box-arrow-in-right';
            if (event.includes('deposit')) return 'bi-wallet2';
            if (event.includes('order')) return 'bi-bag-check';
            return 'bi-activity';
          };
          return (
            <div key={act.id} className="list-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className={`bi ${getIcon(act.event)}`} style={{ color: 'var(--muted)' }} />
                <div>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                    {act.event.replace(':', ' ').replace('_', ' ')}
                  </div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>
                    {formatDateTime(act.created_at)}
                  </div>
                </div>
              </div>
              <div className="muted" style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                {act.detail.length > 50 ? act.detail.substring(0, 50) + '...' : act.detail}
              </div>
            </div>
          );
        })}
        {(activities?.activities?.length || 0) > 10 && (
          <div className="muted" style={{ textAlign: 'center', padding: '8px' }}>
            Dan {(activities.activities.length - 10)} lainnya...
          </div>
        )}
        {!activities?.activities?.length && <div className="muted">Belum ada aktivitas.</div>}
      </div>
    </Page>
  );
}
