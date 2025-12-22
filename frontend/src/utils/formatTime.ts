// utils/formatTime.ts - Format waktu
export function formatTime(date: string): string {
  return new Date(date).toLocaleDateString('id-ID');
}