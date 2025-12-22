import { useContext } from 'react';
import { ToastContext } from '../components/Toast';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus di dalam ToastProvider');
  return ctx;
}