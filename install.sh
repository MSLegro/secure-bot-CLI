#!/usr/bin/env bash

set -e

REPO="MSlegro/secure-bot-cli"
VERSION=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep tag_name | cut -d '"' -f4)
DEB_NAME="securebot_${VERSION}_amd64.deb"
DEB_URL="https://github.com/$REPO/releases/download/$VERSION/$DEB_NAME"

TMP_DEB="/tmp/$DEB_NAME"

echo "⬇️  Descargando paquete .deb desde GitHub Releases ($VERSION)..."
curl -sL "$DEB_URL" -o "$TMP_DEB"

echo "📦 Instalando paquete..."
sudo dpkg -i "$TMP_DEB"

echo "✅ SecureBot instalado o actualizado correctamente."
echo "🧪 Verificando versión:"
securebot --version
