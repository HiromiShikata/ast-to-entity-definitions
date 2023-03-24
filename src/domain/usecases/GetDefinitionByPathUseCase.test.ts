import { GetDefinitionByPathUseCase } from './GetDefinitionByPathUseCase';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { Definition } from '../entities/Definition';
import { EntityDefinition } from '../entities/EntityDefinition';

describe('GetDefinitionByPathUseCase', () => {
  describe('run', () => {
    it('returns definitions with no relations for empty directory', async () => {
      const directoryPath = '/example/directory/path';
      const expectedDefinitions: Definition = {
        entityDefinitions: [],
        relationDefinitions: [],
      };
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedDefinitions);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(
        directoryPath,
      );
    });

    it('returns definitions with relations for directory with related entity definitions', async () => {
      const directoryPath = '/example/directory/path';
      const expectedDefinitions: Definition = {
        entityDefinitions: [
          {
            typeName: 'User',
            properties: [
              { name: 'id', propertyType: 'number' },
              { name: 'name', propertyType: 'string' },
              { name: 'email', propertyType: 'string' },
            ],
          },
          {
            typeName: 'Group',
            properties: [
              { name: 'id', propertyType: 'number' },
              { name: 'name', propertyType: 'string' },
            ],
          },

          {
            typeName: 'UserGroup',
            properties: [
              { name: 'id', propertyType: 'number' },
              { name: 'userId', propertyType: 'User' },
              { name: 'groupId', propertyType: 'Group' },
            ],
          },
        ],
        relationDefinitions: [
          {
            name: 'userId',
            sourceEntityDefinitionName: 'UserGroup',
            targetEntityDefinitionName: 'User',
          },

          {
            name: 'groupId',
            sourceEntityDefinitionName: 'UserGroup',
            targetEntityDefinitionName: 'Group',
          },
        ],
      };
      const entityDefinitions: EntityDefinition[] = [
        {
          typeName: 'User',
          properties: [
            { name: 'id', propertyType: 'number' },
            { name: 'name', propertyType: 'string' },
            { name: 'email', propertyType: 'string' },
          ],
        },
        {
          typeName: 'Group',
          properties: [
            { name: 'id', propertyType: 'number' },
            { name: 'name', propertyType: 'string' },
          ],
        },

        {
          typeName: 'UserGroup',
          properties: [
            { name: 'id', propertyType: 'number' },
            { name: 'userId', propertyType: 'User' },
            { name: 'groupId', propertyType: 'Group' },
          ],
        },
      ];
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      entityDefinitionRepository.find.mockResolvedValueOnce(entityDefinitions);

      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedDefinitions);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(
        directoryPath,
      );
    });
  });
  const createUseCaseAndMockRepositories = () => {
    const entityDefinitionRepository = createMockEntityDefinitionRepository();
    const useCase = new GetDefinitionByPathUseCase(entityDefinitionRepository);
    return {
      entityDefinitionRepository,
      useCase,
    };
  };
  const createMockEntityDefinitionRepository = () => {
    const repository: EntityDefinitionRepository = {
      find: async (_path: string): Promise<EntityDefinition[]> => {
        return [];
      },
    };
    return {
      find: jest.fn((path: string) => repository.find(path)),
    };
  };
});
