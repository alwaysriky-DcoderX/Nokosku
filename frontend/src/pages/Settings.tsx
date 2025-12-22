// pages/Settings.tsx - Settings page
import { useState, useEffect } from 'react';

export function Settings() {
  const [theme, setTheme] = useState('auto');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'auto';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (t: string) => {
    if (t === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
  };

  const handleThemeChange = (t: string) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    applyTheme(t);
  };

  const handleNotif = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          alert('Notifikasi diaktifkan');
        }
      });
    }
  };

  return (
    <div className="settings">
      <h2>Pengaturan</h2>
      <div>
        <label>Tema:</label>
        <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={handleNotif}>Aktifkan Notifikasi Browser</button>
      <a href="https://t.me/nokoskucs" target="_blank">Butuh bantuan? chat CS</a>
    </div>
  );
}