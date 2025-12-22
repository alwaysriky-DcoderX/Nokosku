#!/bin/bash
# Deploy NOKOSKU to Ubuntu 22.04

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js, MySQL, Nginx, PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server nginx pm2

# Clone repo
cd /var/www
git clone https://github.com/yourrepo/nokosku.git
cd nokosku
npm install --production

# Setup DB
mysql -u root -p < infra/01_schema.sql

# Setup .env (manual copy)

# Start app
pm2 start server.js --name nokosku
pm2 save
pm2 startup

# Nginx config
sudo cp infra/nginx.conf /etc/nginx/sites-available/nokosku
sudo ln -s /etc/nginx/sites-available/nokosku /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d nokosku.com

echo "Deploy complete!"