# 🛡️ SecureBot CLI

Un gestor de contraseñas en la terminal, **seguro**, **portable** y hecho para devs.

![badge](https://img.shields.io/github/v/release/MSlegro/secure-bot-cli?label=version&style=flat-square)
![badge](https://img.shields.io/github/actions/workflow/status/MSlegro/secure-bot-cli/release.yml?label=build&style=flat-square)

---

## 🚀 Instalación (Linux)

### 📦 Usando el instalador automático

```bash
curl -sL https://raw.githubusercontent.com/MSlegro/securebot-cli/main/install.sh | bash
```

### 📦 O manual con `.deb`

```bash
curl -sL https://github.com/MSlegro/securebot-cli/releases/latest/download/securebot_1.0.1_amd64.deb -o securebot.deb
sudo dpkg -i securebot.deb
```

---

## 💻 Uso básico

```bash
securebot init                      # Inicializa el vault (clave maestra)
securebot add --name Gmail          # Agrega una entrada
securebot get --name Gmail          # Recupera las credenciales
securebot list                      # Lista todas las cuentas guardadas
```

> Todo cifrado localmente con AES-256-CBC + clave derivada por Argon2.

---

## 🔐 Seguridad

- ✨ **Cifrado AES-256 + Argon2**
- 📁 Los datos se guardan localmente en `~/.securebot/`
- 🔒 El vault se desbloquea solo con tu clave maestra
- 🧠 Nada se sube a la nube, ni se sincroniza: **todo local**

---

## 🔧 Build manual (devs)

```bash
git clone https://github.com/MSlegro/securebot-cli.git
cd securebot-cli
npm install
npm run dev # o
npm run build && npm run pkg:build
```

---

## 🤖 Contribuciones

Pull requests y issues son más que bienvenidos 🙌

---

## 👨‍💻 Autor

Made with ❤️ by [MSlegro](https://github.com/MSlegro)
