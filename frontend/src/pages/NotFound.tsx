// pages/NotFound.tsx - 404 page
import { useNavigate } from 'react-router-dom';
import { CatLottie } from '../ui/components/CatLottie';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <CatLottie variant="notFound" size="lg" />
      <p>Halaman ini nggak ada. Balik dulu ya.</p>
      <button onClick={() => navigate('/home')}>Ke Home</button>
    </div>
  );
}