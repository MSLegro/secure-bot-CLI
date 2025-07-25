// securebot-cli/src/commands/list.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import { deriveKey, decrypt } from '../services/crypto.service';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const listCommand = new Command('list')
  .description('Muestra todas las cuentas guardadas')
  .action(async () => {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
      console.log('❌ No se encontró la base de datos. Ejecutá "securebot init" primero.');
      return;
    }

    const { passphrase } = await inquirer.prompt([
      {
        type: 'password',
        name: 'passphrase',
        message: '🔐 Ingresá tu clave maestra:',
        mask: '*',
      },
    ]);

    const key = await deriveKey(passphrase);
    const encryptedData = fs.readFileSync(CREDENTIALS_FILE, 'utf8');

    let decrypted: Record<string, { user: string; password: string }> = {};
    try {
      decrypted = JSON.parse(decrypt(encryptedData, key));
    } catch (err) {
      console.log(`❌ Clave maestra incorrecta o archivo dañado.  Error: ${err}`);
      return;
    }

    const accounts = Object.keys(decrypted);
    if (!accounts.length) {
      console.log('📭 No tenés cuentas guardadas aún.');
      return;
    }

    console.log('\n🔐 Cuentas guardadas:');
    accounts.forEach(name => {
      console.log(`- ${name}`);
    });
    console.log();
  });
