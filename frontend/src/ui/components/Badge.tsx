// ui/components/Badge.tsx - Badge untuk status
interface BadgeProps {
  status: 'pending' | 'processing' | 'success' | 'failed' | 'expired' | 'cancel';
  children: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  return <span className={`badge badge-${status}`}>{children}</span>;
}