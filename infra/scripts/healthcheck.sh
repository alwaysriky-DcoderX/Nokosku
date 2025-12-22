#!/bin/bash
# NOKOSKU Health Check Script
echo "Cek koneksi DB..."
mysqladmin ping -h localhost > /dev/null && echo "MySQL OK" || echo "MySQL ERROR"
echo "Cek koneksi Redis..."
redis-cli ping | grep PONG && echo "Redis OK" || echo "Redis ERROR"
curl -s http://localhost:3000/health | grep 'status' && echo "API OK" || echo "API ERROR"
