#!/bin/bash
# Backup DB harian NOKOSKU
DATE=$(date +%Y%m%d)
mysqldump -u root -p nokosku > /var/www/Nokosku/backup/db_backup_$DATE.sql