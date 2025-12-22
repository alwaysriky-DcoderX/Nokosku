// pages/Profile.tsx - Profile page
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="profile">
      <h2>Profil</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/orders')}>Riwayat Deposit</button>
      <button onClick={() => navigate('/settings')}>Pengaturan</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}