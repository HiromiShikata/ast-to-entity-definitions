#!/usr/bin/env node
import { Command } from 'commander';
import { GetDefinitionByPathUseCase } from '../../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../../repositories/TsMorphEntityDefinitionRepository';
import { LocalFileSystemOperator } from '../../operators/LocalFileSystemOperator';
import { readFileSync } from 'fs';
import { Configs } from '../../../domain/entities/Configs';

const isValidOptionsFile = (obj: unknown): obj is Configs => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  // Check excludeTypeNames if present
  if ('excludeTypeNames' in obj && obj.excludeTypeNames !== undefined) {
    if (!Array.isArray(obj.excludeTypeNames)) {
      return false;
    }
    if (!obj.excludeTypeNames.every((item) => typeof item === 'string')) {
      return false;
    }
  }

  // Check excludeFileNames if present
  if ('excludeFileNames' in obj && obj.excludeFileNames !== undefined) {
    if (!Array.isArray(obj.excludeFileNames)) {
      return false;
    }
    if (!obj.excludeFileNames.every((item) => typeof item === 'string')) {
      return false;
    }
  }

  return true;
};

const program = new Command();
program
  .argument('<path>', 'Path of domain entity directory')
  .option('-c, --config <configPath>', 'Path to configuration file (JSON)')
  .name('Get entity definitions')
  .description(
    'Get entity definitions and relation definitions from types of TypeScript in src directory',
  )
  .action(async (path: string, options: { config?: string }) => {
    let configFile: Configs | undefined;

    if (options.config) {
      try {
        const configContent = readFileSync(options.config, 'utf-8');
        const parsedConfig = JSON.parse(configContent) as unknown;

        if (!isValidOptionsFile(parsedConfig)) {
          console.error(
            'Error: Invalid configuration file format. Expected format: { excludeTypeNames?: string[], excludeFileNames?: string[] }',
          );
          process.exit(1);
        }

        configFile = parsedConfig;
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error reading configuration file: ${error.message}`);
        } else {
          console.error('Error reading configuration file');
        }
        process.exit(1);
      }
    }

    const useCase = new GetDefinitionByPathUseCase(
      new TsMorphEntityDefinitionRepository(),
      new LocalFileSystemOperator(),
    );
    const res = await useCase.run(path, configFile);
    console.log(JSON.stringify(res));
  });
if (process.argv) {
  program.parse(process.argv);
}
