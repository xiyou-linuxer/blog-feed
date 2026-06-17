#!/bin/sh
# 首次获取 SSL 证书，之后 certbot 容器会自动续期
set -e

DOMAIN="${CERTBOT_DOMAIN:-api.xiyoulinux.com}"
EMAIL="${CERTBOT_EMAIL:-root@xiyoulinux.org}"

echo "🔐 正在为 $DOMAIN 申请 SSL 证书..."

echo "🌐 切换到 HTTP 配置并重启 Nginx..."
cp "$(dirname "$0")/nginx-http.conf" "$(dirname "$0")/default.conf"
docker compose up -d nginx

docker compose run --rm --entrypoint certbot certbot \
  certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "🔒 切换到 HTTPS 配置..."
cp "$(dirname "$0")/nginx.conf" "$(dirname "$0")/default.conf"
docker compose restart nginx

echo "✅ 完成！访问 https://$DOMAIN/"
