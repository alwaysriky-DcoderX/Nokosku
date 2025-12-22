import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

type Props = {
  label?: string;
  icon?: string;
  rightSlot?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, icon, rightSlot, type = 'text', ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="form-field">
      {label && <label className="form-label" style={{ fontWeight: 600 }}>{label}</label>}
      <div className="input-group">
        {icon && (
          <span className="input-group-text">
            <i className={`bi ${icon}`}></i>
          </span>
        )}
        <input
          className="form-control"
          type={isPassword ? (show ? 'text' : 'password') : type}
          {...rest}
        />
        {isPassword && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShow(s => !s)}
          >
            <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
          </button>
        )}
        {rightSlot}
      </div>
    </div>
  );
}
