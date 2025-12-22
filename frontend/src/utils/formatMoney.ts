// utils/formatMoney.ts - Format uang ke Rupiah
export function formatMoney(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}