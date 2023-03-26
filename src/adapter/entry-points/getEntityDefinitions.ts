import { GetDefinitionByPathUseCase } from '../../domain/usecases/GetDefinitionByPathUseCase';
import { TsMorphEntityDefinitionRepository } from '../repositories/TsMorphEntityDefinitionRepository';

export const getEntityDefinitions = new GetDefinitionByPathUseCase(
  new TsMorphEntityDefinitionRepository(),
).run;
