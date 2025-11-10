import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { EntityDefinition } from '../entities/EntityDefinition';
import { FileSystemOperator } from './adapter-interfaces/FileSystemOperator';
import { minimatch } from 'minimatch';
import { basename } from 'path';
import { Configs } from '../entities/Configs';

export class GetDefinitionByPathUseCase {
  constructor(
    readonly entityDefinitionRepository: EntityDefinitionRepository,
    readonly fileSystemOperator: FileSystemOperator,
  ) {}
  run = async (
    directoryPath: string,
    configs?: Configs,
  ): Promise<EntityDefinition[]> => {
    // 1. Get all files from directory
    const allFiles = this.fileSystemOperator.list(directoryPath);

    // 2. Filter files by excludeFileNames patterns
    const filteredFiles = this.filterFilesByPattern(
      allFiles,
      configs?.excludeFileNames,
    );

    // 3. Get entity definitions from filtered files
    const entityDefinitions = await this.entityDefinitionRepository.find(
      filteredFiles,
    );

    // 4. Filter by excludeTypeNames
    return entityDefinitions.filter(
      (def) =>
        !configs?.excludeTypeNames ||
        !configs.excludeTypeNames.includes(def.name),
    );
  };

  private filterFilesByPattern(files: string[], patterns?: string[]): string[] {
    if (!patterns || patterns.length === 0) {
      return files;
    }

    return files.filter((file) => {
      const fileName = basename(file);
      return !patterns.some((pattern) => minimatch(fileName, pattern));
    });
  }
}
