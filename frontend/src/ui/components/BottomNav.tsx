// ui/components/BottomNav.tsx - Bottom navigation untuk mobile
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, List, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const items = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/buy', icon: ShoppingCart, label: 'Beli' },
    { to: '/orders', icon: List, label: 'Riwayat' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`bottom-nav-item ${location.pathname === item.to ? 'active' : ''}`}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}