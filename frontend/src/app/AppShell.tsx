// app/AppShell.tsx - App shell with layout
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../ui/components/BottomNav';

export function AppShell() {
  const location = useLocation();
  const hideNav = ['/login', '/register', '/welcome', '/'].includes(location.pathname);

  return (
    <div className="app-shell">
      <main className="main-content">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}