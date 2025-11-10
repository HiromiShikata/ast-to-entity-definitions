import { GetDefinitionByPathUseCase } from '../../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../../repositories/TsMorphEntityDefinitionRepository';
import { LocalFileSystemOperator } from '../../operators/LocalFileSystemOperator';
import { Configs } from '../../../domain/entities/Configs';

export const getEntityDefinitions = (
  directoryPath: string,
  configs?: Configs,
) => {
  const useCase = new GetDefinitionByPathUseCase(
    new TsMorphEntityDefinitionRepository(),
    new LocalFileSystemOperator(),
  );
  return useCase.run(directoryPath, configs);
};
