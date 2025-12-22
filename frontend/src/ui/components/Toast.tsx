// ui/components/Toast.tsx - Custom toast untuk Nokosku
import { useEffect, useState } from 'react';
import { CatLottie } from './CatLottie';

type ToastType = 'info' | 'loading' | 'success' | 'error';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

let toastQueue: ToastData[] = [];
let setToasts: React.Dispatch<React.SetStateAction<ToastData[]>> | null = null;

export function ToastContainer() {
  const [toasts, setToastsState] = useState<ToastData[]>([]);
  setToasts = setToastsState;

  useEffect(() => {
    const timer = setInterval(() => {
      setToastsState((prev) => prev.filter((t) => Date.now() - parseInt(t.id) < 6500));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <CatLottie variant={getLottieVariant(toast.type)} size="sm" />
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getLottieVariant(type: ToastType): 'hint' | 'loading' | 'successCheck' | 'error' {
  switch (type) {
    case 'info':
      return 'hint';
    case 'loading':
      return 'loading';
    case 'success':
      return 'successCheck';
    case 'error':
      return 'error';
  }
}

export function showToast(message: string, type: ToastType = 'info') {
  if (!setToasts) return;
  const id = Date.now().toString();
  const toast: ToastData = { id, message, type };
  toastQueue.push(toast);
  setToasts((prev) => [...prev, toast]);
}