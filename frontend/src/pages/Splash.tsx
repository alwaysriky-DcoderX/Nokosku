// pages/Splash.tsx - Splash screen
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      navigate(token ? '/home' : '/welcome');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash">
      <h1>NOKOSKU</h1>
    </div>
  );
}