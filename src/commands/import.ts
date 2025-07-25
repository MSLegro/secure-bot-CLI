// securebot-cli/src/commands/import.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const importCommand = new Command('import')
  .description('Importa un archivo de backup cifrado')
  .option('--path <path>', 'Ruta al archivo backup')
  .action(async (options) => {
    if (!options.path) {
      console.log('❌ Debés indicar la ruta al backup con --path.');
      return;
    }

    const source = path.resolve(process.cwd(), options.path);
    if (!fs.existsSync(source)) {
      console.log('❌ No se encontró el archivo especificado.');
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '⚠️ Esto sobrescribirá tus credenciales actuales. ¿Continuar?',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('❌ Importación cancelada.');
      return;
    }

    try {
      fs.copyFileSync(source, CREDENTIALS_FILE);
      console.log('✅ Backup restaurado exitosamente.');
    } catch (err) {
      console.log('❌ Error al restaurar el backup:', err);
    }
  });
