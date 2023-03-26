#!/usr/bin/env node
import { Command } from 'commander';
import { GetDefinitionByPathUseCase } from '../../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../../repositories/TsMorphEntityDefinitionRepository';

const program = new Command();
program
  .argument('<path>', 'Path of domain entity directory')
  .name('Get entity definitions')
  .description(
    'Get entity definitions and relation definitions from types of TypeScript in src directory',
  )
  .action(async (path: string) => {
    const useCase = new GetDefinitionByPathUseCase(
      new TsMorphEntityDefinitionRepository(),
    );
    const res = await useCase.run(path);
    console.log(JSON.stringify(res));
  });
if (process.argv) {
  program.parse(process.argv);
}
