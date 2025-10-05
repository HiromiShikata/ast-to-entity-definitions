import {
  GetDefinitionByPathUseCase,
  GetDefinitionByPathOptions,
} from '../../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../../repositories/TsMorphEntityDefinitionRepository';

export const getEntityDefinitions = (
  directoryPath: string,
  options?: GetDefinitionByPathOptions,
) => {
  const useCase = new GetDefinitionByPathUseCase(
    new TsMorphEntityDefinitionRepository(),
  );
  return useCase.run(directoryPath, options);
};
