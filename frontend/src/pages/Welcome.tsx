// pages/Welcome.tsx - Onboarding welcome
import { useNavigate } from 'react-router-dom';
import { CatLottie } from '../ui/components/CatLottie';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <CatLottie variant="welcome" size="lg" />
      <h1>Beli nomor OTP, tanpa ribet.</h1>
      <p>Pilih aplikasi → bayar → OTP masuk realtime.</p>
      <div className="welcome-actions">
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Mulai
        </button>
        <button className="btn-secondary" onClick={() => navigate('/register')}>
          Saya baru, bikin akun
        </button>
      </div>
    </div>
  );
}