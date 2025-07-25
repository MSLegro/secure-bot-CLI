// securebot-cli/src/commands/add.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import { deriveKey, decrypt, encrypt } from '../services/crypto.service';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const addCommand = new Command('add')
  .description('Agrega una nueva credencial cifrada')
  .option('--name <name>', 'Nombre de la cuenta')
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

    const { accountName, username, password } = await inquirer.prompt([
      {
        type: 'input',
        name: 'accountName',
        message: '🔖 Nombre de la cuenta:',
        default: options.name,
        validate: val => !!val || 'El nombre es requerido',
      },
      {
        type: 'input',
        name: 'username',
        message: '📬 Usuario o email:',
      },
      {
        type: 'password',
        name: 'password',
        message: '🔑 Contraseña:',
        mask: '*'
      },
    ]);

    decrypted[accountName] = { user: username, password };
    const updatedEncrypted = encrypt(JSON.stringify(decrypted), key);
    fs.writeFileSync(CREDENTIALS_FILE, updatedEncrypted);

    console.log(`✅ Credencial '${accountName}' guardada con éxito.`);
  });
