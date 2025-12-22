# NOKOSKU - Platform Nomor Virtual OTP

## Fitur Utama
- Beli nomor virtual untuk terima OTP WhatsApp, Telegram, dll.
- Deposit via QRIS Atlantic atau RumahOTP.
- Real-time notifikasi OTP masuk.
- Auto-cancel jika OTP tidak masuk dalam 15 menit.

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Daftar user
- `POST /api/v1/auth/login` - Login user

### Deposit
- `POST /api/v1/deposit/create` - Buat deposit QRIS
- `GET /api/v1/deposit/:id` - Cek status deposit

### Order
- `POST /api/v1/orders/create` - Beli nomor virtual
- `GET /api/v1/orders/:id` - Cek status order

### Admin (hanya admin)
- `GET /api/v1/admin/stats` - Lihat statistik
- `GET /api/v1/admin/users` - Daftar user
- `PUT /api/v1/admin/users/:id` - Ban user
- `POST /api/v1/admin/refund` - Refund manual
- `GET /api/v1/admin/audit` - Log audit

## FAQ
- **Ribet ga?** Engga, tinggal pilih & bayar.
- **OTP ga masuk?** Kalau gagal, saldo balik otomatis.
- **Harus nunggu di web?** Boleh ditinggal, kami notif.

## Instalasi & Deployment

### Development
1. Clone repo: `git clone <repo-url>`
2. `npm install`
3. Setup .env:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=nokosku
   JWT_SECRET=your-secret
   RUMAHOTP_APIKEY=otp_...
   ATLANTIC_APIKEY=OtvBx...
   ```
4. Migrate DB: `mysql -u root nokosku < infra/01_schema.sql`
5. `npm start`

### Production (Ubuntu 22.04)
1. Server setup: `sudo apt update && sudo apt install -y nginx mysql-server nodejs npm redis-server`
2. Clone & install: `git clone <repo> && cd nokosku && npm install --production`
3. Setup .env production
4. PM2: `pm2 start ecosystem.config.js && pm2 save && pm2 startup`
5. Nginx: Copy `infra/nginx.conf`, enable, reload
6. SSL: `sudo certbot --nginx -d nokosku.com`
7. Backup: Cron `0 2 * * * /var/www/Nokosku/backup.sh`

### Monitoring
- PM2 Dashboard: `pm2 monit`
- Logs: `/var/www/Nokosku/logs/`
- Health: `GET /health` (uptime, memory, version)
- Custom: Winston logs with rotation

## API Documentation
Lihat `API-DOCS.md` untuk lengkap endpoint, request/response, WebSocket events.

## Troubleshooting
- DB: Cek connection, migrate schema.
- Socket.io: Port 3000 open.
- Rate limit: 100 req/15min.
- Logs: Check `/logs/error-*.log`

## Support
CS Telegram: https://t.me/nokoskucs