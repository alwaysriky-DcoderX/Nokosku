// pages/Login.tsx - Login page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { showToast } from '../ui/components/Toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        localStorage.setItem('token', res.token!);
        localStorage.setItem('user', JSON.stringify(res));
        showToast('Masuk. lanjut ya.', 'success');
        navigate('/home');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Login gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Welcome back!</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <Link to="/register">Belum punya akun? Daftar</Link>
    </div>
  );
}