// securebot-cli/src/commands/get.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import { deriveKey, decrypt } from '../services/crypto.service';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const getCommand = new Command('get')
  .description('Recupera una credencial por nombre')
  .option('--name <name>', 'Nombre de la cuenta a buscar')
  .action(async (options) => {
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

    const accountName = options.name || (await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '🔖 Nombre de la cuenta a recuperar:',
        validate: val => !!val || 'El nombre es requerido',
      },
    ])).name;

    const entry = decrypted[accountName];
    if (!entry) {
      console.log(`❌ No se encontró la cuenta '${accountName}'.`);
      return;
    }

    console.log(`\n📬 Usuario: ${entry.user}`);
    console.log(`🔑 Contraseña: ${entry.password}\n`);
  });
