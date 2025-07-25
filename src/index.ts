import { Command } from 'commander';
import { addCommand, exportCommand, getCommand, importCommand, initCommand, listCommand } from './commands';

const program = new Command();

program
  .name('securebot')
  .description('🔐 Gestor de contraseñas CLI encriptado')
  .version('1.0.0')

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(getCommand);
program.addCommand(listCommand);
program.addCommand(exportCommand);
program.addCommand(importCommand);

program.parse();
