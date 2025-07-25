// securebot-cli/src/commands/export.ts
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = 'data/credentials.enc.json';

export const exportCommand = new Command('export')
  .description('Exporta un backup cifrado de tus credenciales')
  .option('--path <path>', 'Ruta destino del backup', 'backup.sbk')
  .action(async (options) => {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
      console.log('❌ No hay credenciales para exportar. Ejecutá "securebot init" primero.');
      return;
    }

    const dest = path.resolve(process.cwd(), options.path);

    try {
      fs.copyFileSync(CREDENTIALS_FILE, dest);
      console.log(`✅ Backup guardado en: ${dest}`);
    } catch (err) {
      console.log('❌ Error al guardar el backup:', err);
    }
  });
