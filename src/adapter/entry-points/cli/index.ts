#!/usr/bin/env node
import { Command } from 'commander';
import { GetDefinitionByPathUseCase } from '../../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../../repositories/TsMorphEntityDefinitionRepository';
import { readFileSync } from 'fs';

type ConfigFile = {
  excludeTypeNames?: string[];
};

const isValidConfigFile = (obj: unknown): obj is ConfigFile => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const config = obj as Record<string, unknown>;
  
  if (config.excludeTypeNames !== undefined) {
    if (!Array.isArray(config.excludeTypeNames)) {
      return false;
    }
    if (!config.excludeTypeNames.every((item) => typeof item === 'string')) {
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
    let configFile: ConfigFile | undefined;

    if (options.config) {
      try {
        const configContent = readFileSync(options.config, 'utf-8');
        const parsedConfig = JSON.parse(configContent) as unknown;

        if (!isValidConfigFile(parsedConfig)) {
          console.error(
            'Error: Invalid configuration file format. Expected format: { excludeTypeNames?: string[] }',
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
    );
    const res = await useCase.run(path, configFile);
    console.log(JSON.stringify(res));
  });
if (process.argv) {
  program.parse(process.argv);
}
