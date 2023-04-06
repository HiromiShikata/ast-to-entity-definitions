import { GetDefinitionByPathUseCase } from './GetDefinitionByPathUseCase';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { EntityDefinition } from '../entities/EntityDefinition';

describe('GetDefinitionByPathUseCase', () => {
  describe('run', () => {
    it('returns definitions with no relations for empty directory', async () => {
      const directoryPath = '/example/directory/path';
      const expectedEntityDefinitions: EntityDefinition[] = [];
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedEntityDefinitions);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(
        directoryPath,
      );
    });

    it('returns definitions with relations for directory with related entity definitions', async () => {
      const directoryPath = '/example/directory/path';
      const expectedEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'email',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'category',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: ['Sports', 'Music', 'Movies'],
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
            {
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'address',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const entityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'email',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },

            {
              name: 'category',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: ['Sports', 'Music', 'Movies'],
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
            {
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: `User`,
              isReference: true,
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'address',
              propertyType: 'string',
              isReference: false,
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
      ];
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      entityDefinitionRepository.find.mockResolvedValueOnce(entityDefinitions);
      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedEntityDefinitions);
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
