// securebot-cli/src/commands/init.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { deriveKey, encrypt } from '../services/crypto.service';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const initCommand = new Command('init')
  .description('Inicializa el entorno del usuario')
  .action(async () => {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      console.log('⚠️  Ya existe una base de credenciales. Si querés reiniciar, borrala manualmente.');
      return;
    }

    const { passphrase } = await inquirer.prompt([
      {
        type: 'password',
        name: 'passphrase',
        message: '🔐 Elegí tu clave maestra:',
        mask: '*',
        validate: (val) => val.length < 6 ? 'Debe tener al menos 6 caracteres' : true,
      },
    ]);

    const key = await deriveKey(passphrase);

    // Estructura vacía cifrada
    const empty = JSON.stringify({});
    const encrypted = encrypt(empty, key);

    // Crear directorio si no existe
    const dir = path.dirname(CREDENTIALS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(CREDENTIALS_FILE, encrypted);

    console.log('✅ Entorno inicializado correctamente. ¡Estás listo para guardar contraseñas!');
  });
