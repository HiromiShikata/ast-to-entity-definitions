import { Command } from 'commander';
import { GetDefinitionByPathUseCase } from './domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from './adapter/repositories/TsMorphEntityDefinitionRepository';

const program = new Command();
program
  .command('get definition <path>')
  .description('Get entity definitions and relation definitions')
  .action(async (path: string) => {
    const useCase = new GetDefinitionByPathUseCase(
      new TsMorphEntityDefinitionRepository(),
    );
    const res = await useCase.run(path);
    console.log(JSON.stringify(res));
  });
program.parse(process.argv);
export * from './adapter/entry-points';
