// ui/components/TopBar.tsx - Top bar dengan back dan title
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function TopBar({ title, showBack = false, rightElement }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      {showBack && (
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="top-bar-title">{title}</h1>
      <div className="top-bar-right">{rightElement}</div>
    </div>
  );
}