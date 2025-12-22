# NOKOSKU Frontend

Frontend React + Vite untuk platform virtual number OTP.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy env:
   ```bash
   cp .env.example .env.local
   ```

3. Run dev:
   ```bash
   npm run dev
   ```

4. Backend harus running di localhost:3000.

## Cara Test Manual

1. **Splash**: Buka /, tunggu 1.5s redirect ke /welcome atau /home.

2. **Welcome**: Klik "Mulai" -> /login.

3. **Register**: Isi form -> register -> toast success -> redirect /login.

4. **Login**: Isi email/password -> login -> toast success -> /home.

5. **Home**: Lihat saldo, quick actions, recent orders.

6. **Deposit**: Pilih nominal -> "Lanjutkan" -> /deposit/:id -> scan QR (simulasi).

7. **Buy**: Pilih service -> negara -> operator -> create order -> /orders/:id.

8. **Order Detail**: Lihat nomor, status, countdown, OTP realtime.

9. **Orders**: List history, klik item -> detail.

10. **Profile**: Lihat info, logout.

11. **Settings**: Toggle theme, enable notif.

## Flow Utama

- Register/Login -> Home -> Topup (QR) -> Saldo update
- Home -> Buy -> Order detail -> OTP masuk (toast + notif)

Semua data dari backend, tidak ada mock.
