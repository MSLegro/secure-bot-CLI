#!/usr/bin/env bash

set -e

REPO="MSlegro/securebot-cli"
VERSION="latest"
BINARY_NAME="securebot"
INSTALL_PATH="/usr/local/bin/securebot"

echo "⬇️  Descargando $BINARY_NAME desde GitHub Releases..."
curl -sL "https://github.com/$REPO/releases/download/$VERSION/$BINARY_NAME" -o "$BINARY_NAME"

chmod +x "$BINARY_NAME"
echo "📦 Instalando en $INSTALL_PATH..."
sudo mv "$BINARY_NAME" "$INSTALL_PATH"

echo "✅ SecureBot instalado correctamente."
echo "🧪 Verificando versión:"
$INSTALL_PATH --version
