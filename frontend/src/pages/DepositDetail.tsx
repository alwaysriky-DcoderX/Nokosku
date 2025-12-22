import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelDeposit, getDeposit } from '../api/deposit';
import { Page } from '../ui/layouts/Page';
import { Badge } from '../ui/components/Badge';
import { CatLottie } from '../ui/components/CatLottie';
import { formatMoney } from '../utils/formatMoney';
import { formatRelativeMinutes } from '../utils/formatTime';
import { useToast } from '../ui/hooks/useToast';
import { useSocket } from '../app/hooks/useSocket';

export function DepositDetail() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data, refetch } = useQuery({
    queryKey: ['deposit', id],
    queryFn: () => getDeposit(String(id)),
    enabled: !!id,
    refetchInterval: query => {
      const status = query.state.data?.deposit?.status;
      return status === 'pending' ? 7000 : false;
    }
  });

  const deposit = data?.deposit;
  const status = deposit?.status;

  useEffect(() => {
    if (!socket) return;
     const paidHandler = (payload: unknown) => {
       const p = payload as { deposit_id?: string | number };
       if (p?.deposit_id?.toString() === id) {
        queryClient.invalidateQueries({ queryKey: ['deposit', id] });
        toast.push({ type: 'success', title: 'Saldo udah masuk.' });
      }
    };
    socket.on('deposit:paid', paidHandler);
    return () => {
      socket.off('deposit:paid', paidHandler);
    };
  }, [socket, id, queryClient, toast]);

  const badgeTone =
    status === 'success' ? 'success' : status === 'pending' ? 'warning' : status === 'cancel' ? 'muted' : 'danger';

  const handleCancel = async () => {
    console.log(`Frontend cancel: id=${id}, status=${status}`);
    if (!id || status !== 'pending') {
      toast.push({ type: 'error', title: 'Deposit tidak bisa dicancel.' });
      return;
    }
    try {
      await cancelDeposit(id);
      toast.push({ type: 'info', title: 'Deposit dibatalkan.' });
      queryClient.invalidateQueries({ queryKey: ['deposit', id] });
      // Update local data immediately
      queryClient.setQueryData(['deposit', id], (oldData: any) => ({
        ...oldData,
        deposit: { ...oldData.deposit, status: 'cancel' }
      }));
      refetch();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err?.response?.data?.error || 'Gagal cancel.';
      console.log('Cancel error:', err);
      toast.push({ type: 'error', title: message });
    }
  };

  const qrImage =
    (deposit?.provider_response as any)?.qr_image ||
    (deposit?.provider_response as any)?.qr_url ||
    (deposit?.provider_response as any)?.qr ||
    (deposit?.provider_response as any)?.payment_qr_image;

  const expiresIn = useMemo(() => status === 'pending' && deposit?.expires_at
    ? formatRelativeMinutes(new Date(deposit.expires_at).getTime() - Date.now())
    : null, [status, deposit?.expires_at]);

  return (
    <Page title="Detail Deposit" showBack>
      {!deposit ? (
        <div className="muted">Lagi ambil data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge label={status || deposit.status} tone={badgeTone} />
            <div style={{ fontWeight: 700 }}>{formatMoney(deposit.nominal)}</div>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <CatLottie variant="successCheck" size="lg" />
              <div style={{ marginBottom: 10 }}>Saldo udah masuk.</div>
              <button className="primary-btn" onClick={() => navigate('/home')}>
                Balik ke Home
              </button>
            </div>
          ) : (
            <>
              {qrImage && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={qrImage}
                    alt="QR Pembayaran"
                    style={{ width: 260, height: 260, objectFit: 'contain', borderRadius: 12 }}
                  />
                </div>
              )}
              {(deposit.provider_response as any)?.qr_string && (
                <div className="muted" style={{ wordBreak: 'break-all' }}>
                  {(deposit.provider_response as any).qr_string}
                </div>
              )}
              {expiresIn && (
                <div className="muted">
                  Kadaluarsa {expiresIn}
                </div>
              )}
               <div className="two-col">
                 <button className="primary-btn" type="button" onClick={() => refetch()}>
                   Saya sudah bayar
                 </button>
                 {status === 'pending' && (
                   <button className="ghost-btn" type="button" onClick={handleCancel}>
                     Batalkan
                   </button>
                 )}
               </div>
            </>
          )}
        </div>
      )}
    </Page>
  );
}
