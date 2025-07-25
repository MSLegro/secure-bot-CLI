#!/usr/bin/env bash

set -e

REPO="MSlegro/securebot-cli"
VERSION="latest"
DEB_NAME="securebot_1.0.0_amd64.deb"
DEB_URL="https://github.com/$REPO/releases/download/v1.0.0/$DEB_NAME"

TMP_DEB="/tmp/$DEB_NAME"

echo "⬇️  Descargando paquete .deb desde GitHub Releases..."
curl -sL "$DEB_URL" -o "$TMP_DEB"

echo "📦 Instalando paquete..."
sudo dpkg -i "$TMP_DEB"

echo "✅ SecureBot instalado correctamente."
echo "🧪 Verificando versión:"
securebot --version
